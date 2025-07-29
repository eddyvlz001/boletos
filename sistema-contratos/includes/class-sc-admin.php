<?php
/**
 * The admin-specific functionality of the plugin
 */
class SC_Admin {
    public function enqueue_styles() {
        wp_enqueue_style(
            'sistema-contratos',
            SC_PLUGIN_URL . 'admin/css/sistema-contratos-admin.css',
            array(),
            SC_VERSION,
            'all'
        );
    }

    public function enqueue_scripts() {
        wp_enqueue_script(
            'sistema-contratos',
            SC_PLUGIN_URL . 'admin/js/sistema-contratos-admin.js',
            array('jquery'),
            SC_VERSION,
            false
        );

        wp_localize_script(
            'sistema-contratos',
            'scAjax',
            array(
                'ajax_url' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('sistema-contratos-nonce')
            )
        );
    }

    public function add_plugin_admin_menu() {
        add_menu_page(
            __('Sistema de Contratos', 'sistema-contratos'),
            __('Contratos', 'sistema-contratos'),
            'manage_options',
            'sistema-contratos',
            array($this, 'display_plugin_admin_page'),
            'dashicons-clipboard',
            30
        );

        add_submenu_page(
            'sistema-contratos',
            __('Nuevo Contrato', 'sistema-contratos'),
            __('Nuevo Contrato', 'sistema-contratos'),
            'manage_options',
            'sc-nuevo-contrato',
            array($this, 'display_nuevo_contrato_page')
        );

        add_submenu_page(
            'sistema-contratos',
            __('Órdenes de Trabajo', 'sistema-contratos'),
            __('Órdenes de Trabajo', 'sistema-contratos'),
            'manage_options',
            'sc-ordenes',
            array($this, 'display_ordenes_page')
        );

        add_submenu_page(
            'sistema-contratos',
            __('Configuración', 'sistema-contratos'),
            __('Configuración', 'sistema-contratos'),
            'manage_options',
            'sc-configuracion',
            array($this, 'display_configuracion_page')
        );
    }

    public function display_plugin_admin_page() {
        include_once SC_PLUGIN_DIR . 'admin/partials/sistema-contratos-admin-display.php';
    }

    public function display_nuevo_contrato_page() {
        include_once SC_PLUGIN_DIR . 'admin/partials/sistema-contratos-nuevo-contrato.php';
    }

    public function display_ordenes_page() {
        include_once SC_PLUGIN_DIR . 'admin/partials/sistema-contratos-ordenes.php';
    }

    public function display_configuracion_page() {
        include_once SC_PLUGIN_DIR . 'admin/partials/sistema-contratos-configuracion.php';
    }
}