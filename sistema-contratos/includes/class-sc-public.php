<?php
/**
 * The public-facing functionality of the plugin
 */
class SC_Public {
    public function enqueue_styles() {
        wp_enqueue_style(
            'sistema-contratos',
            SC_PLUGIN_URL . 'public/css/sistema-contratos-public.css',
            array(),
            SC_VERSION,
            'all'
        );
    }

    public function enqueue_scripts() {
        wp_enqueue_script(
            'sistema-contratos',
            SC_PLUGIN_URL . 'public/js/sistema-contratos-public.js',
            array('jquery'),
            SC_VERSION,
            false
        );
    }
}