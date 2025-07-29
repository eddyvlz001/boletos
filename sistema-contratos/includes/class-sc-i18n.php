<?php
/**
 * Define the internationalization functionality
 */
class SC_i18n {
    public function load_plugin_textdomain() {
        load_plugin_textdomain(
            'sistema-contratos',
            false,
            dirname(dirname(plugin_basename(__FILE__))) . '/languages/'
        );
    }
}