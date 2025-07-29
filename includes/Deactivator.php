<?php
namespace SistemaContratos;

class Deactivator {
    public static function deactivate() {
        // Cleanup temporary files
        $upload_dir = wp_upload_dir();
        $temp_dir = $upload_dir['basedir'] . '/sistema-contratos/temp';
        
        if (file_exists($temp_dir)) {
            array_map('unlink', glob("$temp_dir/*.*"));
        }
    }
}