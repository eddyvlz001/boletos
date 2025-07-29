# Sistema de Contratos

Sistema de gestión de contratos, órdenes de trabajo y rifas desarrollado con Vue 3 + TypeScript + Vite.

## Características

- Gestión de contratos y eventos
- Órdenes de trabajo
- Sistema de rifas
- Gestión de clientes
- Impresión de documentos

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Despliegue

### GitHub Pages

El proyecto está configurado para desplegarse automáticamente en GitHub Pages cuando se hace push a la rama main.

1. Fork o clona este repositorio
2. Habilita GitHub Pages en tu repositorio:
   - Ve a Settings > Pages
   - Selecciona la rama gh-pages como origen
   - Guarda los cambios

3. Haz push a la rama main y el workflow se encargará del despliegue

### Aplicación de Escritorio

Para compilar la aplicación de escritorio:

```bash
# Compilar para todas las plataformas
npm run electron:build

# Compilar solo para Mac
npm run electron:mac
```

## Notas Importantes

- La versión web (GitHub Pages) usa localStorage para almacenar los datos
- La versión de escritorio usa SQLite para una base de datos local
- Los datos no se sincronizan entre diferentes instalaciones

## Licencia

MIT