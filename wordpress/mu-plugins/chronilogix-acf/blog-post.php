<?php
/**
 * ACF field group for blog POSTS (post_type == post).
 *
 * Card metadata (eyebrow/tag/topic/read time/gradient/tone/featured/sidebar)
 * plus the long-form article body as Flexible Content — one layout per block
 * type (para/heading/subheading/list/callout/stat) so every block is editable
 * in wp-admin and renders through the original ArticleBody exactly like React.
 */

if (!defined('ABSPATH')) {
    exit;
}

acf_add_local_field_group([
    'key'          => 'group_blog_post',
    'title'        => 'Blog Article',
    'location'     => [[['param' => 'post_type', 'operator' => '==', 'value' => 'post']]],
    'show_in_rest' => 1,
    'menu_order'   => 0,
    'position'     => 'normal',
    'fields'       => [

        // ── Card ────────────────────────────────────────────────────────────
        [ 'key'=>'field_blog_card_tab', 'label'=>'Card', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_blog_eyebrow', 'label'=>'Eyebrow', 'name'=>'eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_blog_tag', 'label'=>'Tag', 'name'=>'tag', 'type'=>'text' ],
        [
            'key'=>'field_blog_topic', 'label'=>'Topic', 'name'=>'topic', 'type'=>'select',
            'choices'=>[
                'Behavioral Health'    => 'Behavioral Health',
                'Chronic Care'         => 'Chronic Care',
                'Clinical Research'    => 'Clinical Research',
                'Product'              => 'Product',
                'Security & Compliance'=> 'Security & Compliance',
            ],
            'ui'=>1,
        ],
        [ 'key'=>'field_blog_read_time', 'label'=>'Read time', 'name'=>'read_time', 'type'=>'text' ],
        [ 'key'=>'field_blog_gradient', 'label'=>'Card gradient (Tailwind classes)', 'name'=>'gradient', 'type'=>'text', 'instructions'=>'e.g. from-[#0F1419] via-[#1F2937] to-[#3F5572]' ],
        [
            'key'=>'field_blog_text_tone', 'label'=>'Text tone', 'name'=>'text_tone', 'type'=>'select',
            'choices'=>[ 'light'=>'light', 'dark'=>'dark' ], 'default_value'=>'light', 'ui'=>1,
        ],
        [ 'key'=>'field_blog_featured', 'label'=>'Featured (hero slot)', 'name'=>'featured', 'type'=>'true_false', 'ui'=>1 ],
        [ 'key'=>'field_blog_sidebar', 'label'=>'Show in featured sidebar', 'name'=>'sidebar', 'type'=>'true_false', 'ui'=>1 ],

        // ── Article ─────────────────────────────────────────────────────────
        [ 'key'=>'field_blog_article_tab', 'label'=>'Article', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_blog_dek', 'label'=>'Dek (standfirst)', 'name'=>'dek', 'type'=>'textarea', 'rows'=>3 ],
        [
            'key'=>'field_blog_body',
            'label'=>'Body',
            'name'=>'body',
            'type'=>'flexible_content',
            'button_label'=>'Add block',
            'layouts'=>[
                'layout_blog_para' => [
                    'key'=>'layout_blog_para', 'name'=>'para', 'label'=>'Paragraph', 'display'=>'block',
                    'sub_fields'=>[ [ 'key'=>'field_blog_para_text', 'label'=>'Text', 'name'=>'text', 'type'=>'textarea', 'rows'=>4 ] ],
                ],
                'layout_blog_heading' => [
                    'key'=>'layout_blog_heading', 'name'=>'heading', 'label'=>'Heading', 'display'=>'block',
                    'sub_fields'=>[ [ 'key'=>'field_blog_heading_text', 'label'=>'Text', 'name'=>'text', 'type'=>'text' ] ],
                ],
                'layout_blog_subheading' => [
                    'key'=>'layout_blog_subheading', 'name'=>'subheading', 'label'=>'Subheading', 'display'=>'block',
                    'sub_fields'=>[ [ 'key'=>'field_blog_subheading_text', 'label'=>'Text', 'name'=>'text', 'type'=>'text' ] ],
                ],
                'layout_blog_list' => [
                    'key'=>'layout_blog_list', 'name'=>'list', 'label'=>'List', 'display'=>'block',
                    'sub_fields'=>[
                        [ 'key'=>'field_blog_list_ordered', 'label'=>'Ordered', 'name'=>'ordered', 'type'=>'true_false', 'ui'=>1 ],
                        [ 'key'=>'field_blog_list_items', 'label'=>'Items', 'name'=>'items', 'type'=>'repeater', 'sub_fields'=>[
                            [ 'key'=>'field_blog_list_items_item', 'label'=>'Item', 'name'=>'item', 'type'=>'textarea', 'rows'=>2 ],
                        ] ],
                    ],
                ],
                'layout_blog_callout' => [
                    'key'=>'layout_blog_callout', 'name'=>'callout', 'label'=>'Callout', 'display'=>'block',
                    'sub_fields'=>[ [ 'key'=>'field_blog_callout_text', 'label'=>'Text', 'name'=>'text', 'type'=>'textarea', 'rows'=>3 ] ],
                ],
                'layout_blog_stat' => [
                    'key'=>'layout_blog_stat', 'name'=>'stat', 'label'=>'Stat', 'display'=>'block',
                    'sub_fields'=>[
                        [ 'key'=>'field_blog_stat_value', 'label'=>'Value', 'name'=>'value', 'type'=>'text' ],
                        [ 'key'=>'field_blog_stat_label', 'label'=>'Label', 'name'=>'label', 'type'=>'textarea', 'rows'=>2 ],
                        [ 'key'=>'field_blog_stat_source', 'label'=>'Source', 'name'=>'source', 'type'=>'text' ],
                    ],
                ],
            ],
        ],
    ],
]);
