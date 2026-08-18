# Migrating ACF changes to another WordPress install

An ACF change is always **two separate things**, and they migrate differently.
Getting one without the other is the usual cause of "I deployed it and the page
still looks the same".

| | What it is | Where it lives | How it travels |
|---|---|---|---|
| **Structure** | Field groups and their fields (`bio` exists, it's a textarea, it sits inside the `team_leaders` repeater) | PHP in `wordpress/mu-plugins/chronilogix-acf/` | Deploy the file. No DB involved. |
| **Values** | The actual content (Nelson's bio text, which image, the CTA URL) | `wp_postmeta` rows in each install's database | Run the matching seeder with wp-cli. |

Structure is code and is identical everywhere. Values are per-install data, and
the seeders are the reproducible way to set them.

## Why not export/import from the ACF admin UI?

The ACF admin's **Tools → Export** only covers field groups, and this project's
groups are **code-defined** via `acf_add_local_field_group()`. They never exist
as `acf-field-group` posts in the database, so the exporter has nothing to hand
you and an import would create a *duplicate* group that fights the code one.
Migrate the PHP file instead.

The admin UI also can't move values. A database dump would, but it would drag
the whole site with it — never restore a local DB over a live one.

## One-time prerequisite

`wordpress/mu-plugins/` is now tracked in this repo. Your deploy has to place it
at the WordPress install's `wp-content/mu-plugins/`. Both the loader file and
the directory are required:

```
wp-content/mu-plugins/chronilogix-acf.php      ← loader; WP only auto-loads files at this top level
wp-content/mu-plugins/chronilogix-acf/*.php    ← one file per page, globbed by the loader
```

Must-use plugins are activated by being present — there is nothing to switch on.
Adding a new page file needs no registration; the loader globs the directory.

## The migration, step by step

Run these on the server, from a checkout of this repo, with `wp` on PATH.

**1. Ship the field-group PHP**

```bash
rsync -av wordpress/mu-plugins/ /path/to/wordpress/wp-content/mu-plugins/
```

Verify the group registered — this must print the fields, not an empty array:

```bash
wp eval 'print_r(wp_list_pluck(acf_get_fields("group_about"), "name"));'
```

**2. Make sure the source images are reachable**

`chr_media()` imports images from the Next.js `public/` folder. It resolves
`CHR_PUBLIC_DIR` relative to this repo by default. If WordPress and this repo
are not siblings on the server, point it explicitly:

```bash
export CHR_PUBLIC_DIR=/var/www/next-wp-main/public
```

The seeders warn loudly at startup if that directory does not exist. Media
import is idempotent — each file is tracked by a `_chr_src` meta key and reused
on re-runs, so nothing duplicates.

**3. Run the seeders for the pages you changed**

```bash
wp eval-file wordpress/acf-seeds/seed-about.php
wp eval-file wordpress/acf-seeds/seed-home.php
```

Re-runnable and idempotent: pages are matched by slug, media by `_chr_src`.

**Note:** seeders write the *whole* field set for a page. If someone has edited
that page in wp-admin, a seeder run overwrites their edits with what's in the
PHP. Treat the seeders as the source of truth, or diff first (step 4).

**4. Verify over REST, not from the seeder's console output**

The console has lied before (a `WP_CLI` guard bug swallowed warnings for
months). Check the API the frontend actually reads:

```bash
curl -s 'https://YOUR-WP-HOST/wp-json/wp/v2/pages?slug=about&_fields=acf&acf_format=standard' \
  | python3 -m json.tool | head -40
```

`acf_format=standard` is required — without it images come back as attachment
IDs instead of URL strings, and the frontend renders nothing.

**5. Flush the Next.js cache**

ACF reads are cached for an hour, so the site keeps serving the old values until
you revalidate. The endpoint needs a JSON body — a bodyless POST 500s.

```bash
curl -X POST https://YOUR-SITE/api/revalidate \
  -H 'content-type: application/json' \
  -H "x-webhook-secret: $WORDPRESS_WEBHOOK_SECRET" \
  -d '{"contentType":"page","contentId":21}'   # About; Home is 8 locally
```

Page IDs are per-install. Get the server's with:

```bash
wp post list --post_type=page --fields=ID,post_name
```

**6. Confirm against rendered HTML**

Changing a component's `DEFAULTS` does **not** change the live site for any
field WordPress supplies — ACF always wins. This has bitten this project three
times. Check the rendered page, not the source:

```bash
curl -s https://YOUR-SITE/about | grep -c 'Visionary leader'
```

## Rollback

Structure: redeploy the previous `mu-plugins/` state. Values: the seeders are
the record — revert the seeder file and re-run it.

## Adding a field later

1. Add the field to the page's file in `wordpress/mu-plugins/chronilogix-acf/`.
2. Add its value to the matching `wordpress/acf-seeds/seed-<slug>.php`.
3. Map it in the page's `app/**/page.tsx` and give the component a default.
4. Run the seeder locally, revalidate, verify rendered HTML.
5. Deploy, then repeat steps 1–6 above on the server.

Keep the field group and the seeder in the same commit. A seeder that writes a
field the deployed group doesn't define stores orphaned meta that ACF will not
read back.
