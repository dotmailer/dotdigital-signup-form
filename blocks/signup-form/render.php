<?php
/**
 * Block Name: Dotdigital Signup Form
 *
 * @var array $attributes
 */
the_widget(
    'DM_Widget',
    array(),
    array(
        'showtitle' => $attributes['showtitle'] ?? false,
        'showdesc' => $attributes['showdesc'] ?? false,
        'redirection' => $attributes['redirecturl'] ?? false,
    )
);
