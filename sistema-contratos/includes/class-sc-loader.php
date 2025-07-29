<?php
/**
 * Register all actions and filters for the plugin
 */
class SC_Loader {
    protected $actions;
    protected $filters;
    protected $admin;
    protected $public;

    public function __construct() {
        $this->actions = array();
        $this->filters = array();
        
        $this->load_dependencies();
        $this->set_locale();
        $this->define_admin_hooks();
        $this->define_public_hooks();
    }

    private function load_dependencies() {
        $this->admin = new SC_Admin();
        $this->public = new SC_Public();
    }

    private function set_locale() {
        $plugin_i18n = new SC_i18n();
        $this->add_action('plugins_loaded', $plugin_i18n, 'load_plugin_textdomain');
    }

    private function define_admin_hooks() {
        $this->add_action('admin_enqueue_scripts', $this->admin, 'enqueue_styles');
        $this->add_action('admin_enqueue_scripts', $this->admin, 'enqueue_scripts');
        $this->add_action('admin_menu', $this->admin, 'add_plugin_admin_menu');
    }

    private function define_public_hooks() {
        $this->add_action('wp_enqueue_scripts', $this->public, 'enqueue_styles');
        $this->add_action('wp_enqueue_scripts', $this->public, 'enqueue_scripts');
    }

    public function add_action($hook, $component, $callback, $priority = 10, $accepted_args = 1) {
        $this->actions = $this->add($this->actions, $hook, $component, $callback, $priority, $accepted_args);
    }

    public function add_filter($hook, $component, $callback, $priority = 10, $accepted_args = 1) {
        $this->filters = $this->add($this->filters, $hook, $component, $callback, $priority, $accepted_args);
    }

    private function add($hooks, $hook, $component, $callback, $priority, $accepted_args) {
        $hooks[] = array(
            'hook'          => $hook,
            'component'     => $component,
            'callback'      => $callback,
            'priority'      => $priority,
            'accepted_args' => $accepted_args
        );
        return $hooks;
    }

    public function run() {
        foreach ($this->filters as $hook) {
            add_filter(
                $hook['hook'],
                array($hook['component'], $hook['callback']),
                $hook['priority'],
                $hook['accepted_args']
            );
        }

        foreach ($this->actions as $hook) {
            add_action(
                $hook['hook'],
                array($hook['component'], $hook['callback']),
                $hook['priority'],
                $hook['accepted_args']
            );
        }
    }
}