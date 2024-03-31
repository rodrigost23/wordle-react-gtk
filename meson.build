project('com.rodrigotavares.Wordle',
    version: '1.0.0',
    meson_version: '>= 0.62.0',
    default_options: [ 'warning_level=2', 'werror=false', ],
)

dependency('glib-2.0', version: '>= 2.72')
dependency('gio-2.0', version: '>= 2.72')
dependency('gtk4', version: '>= 4.12')
dependency('libadwaita-1', version: '>= 1.4')

pkgdatadir = join_paths(get_option('datadir'), meson.project_name())

gnome = import('gnome')

gjs_dep = dependency('gjs-1.0', version: '>= 1.54.0')
gjs_console = gjs_dep.get_variable(pkgconfig: 'gjs_console')

node = find_program('node', required: true)
npm = find_program('npm', required: true)

node_modules = custom_target('node_modules', command: [npm, 'install'], output: 'node_modules')
# run_target(target_name, command: command, build_by_default: true)
custom_target('build', command: [npm, 'run', 'build'], depends: [node_modules], output: 'out', build_by_default: true)
# build = run_target('compile', command: [npm, 'run', 'build'], depends: [node_modules], )
# build_target('build', build)

# src_res = gnome.compile_resources(
#   'com.rodrigotavares.Wordle.src',
#   'com.rodrigotavares.Wordle.src.gresource.xml',
#   dependencies: build,
#   source_dir: 'dist',
#   gresource_bundle: true,
#   install: true,
#   install_dir: pkgdatadir,
# )

bin_conf = configuration_data()
bin_conf.set('PACKAGE_VERSION', meson.project_version())
bin_conf.set('PACKAGE_NAME', meson.project_name())
bin_conf.set('prefix', get_option('prefix'))
bin_conf.set('libdir', join_paths(get_option('prefix'), get_option('libdir')))
bin_conf.set('datadir', join_paths(get_option('prefix'), get_option('datadir')))
bin_conf.set('resource_path', '/com/rodrigotavares/Wordle')

app_launcher = configure_file(
  input: 'build-aux/flatpak/wordle',
  output: 'wordle',
  configuration: bin_conf,
  install: true,
  install_dir: get_option('bindir')
)


# install_data(meson.current_source_dir() / 'build-aux/flatpak/wordle', install_dir: get_option('bindir'))
install_subdir(meson.current_source_dir() / 'dist', strip_directory: true, install_dir: pkgdatadir)

run_target(
  'devel',
  command: ['sh', app_launcher]
)

gnome.post_install(
  # gtk_update_icon_cache: true,
  # glib_compile_schemas: true,
  # update_desktop_database: true,
)

