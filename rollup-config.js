import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs    from 'rollup-plugin-commonjs';
import globals     from 'rollup-plugin-node-globals';
import builtins    from 'rollup-plugin-node-builtins';

export default {
    entry: 'aot/app/main.js',
    dest: 'app/build.js', // output a single application bundle
    sourceMap: true,
    sourceMapFile: 'app/build.js.map',
    format: 'iife',
    onwarn: function(warning) {
        // Skip certain warnings

        // should intercept ... but doesn't in some rollup versions
        if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }

        // console.warn everything else
        console.warn( warning.message );
    },
    plugins: [
        nodeResolve({
            jsnext: true,
            module: true,
            preferBuiltins: false
        }),
        commonjs({
            include: [
                'node_modules/**'
            ]
        }),
        globals(),
        builtins()
    ]
};