const path = require('path');

/**
 * Configure the babel options.
 *
 * @method configureBabel
 * @param  {Object}       [api={}] The babel API parameter
 * @return {Object}                The config
 */
function configureBabel(api = {}) {
    // Turn off Cache.
    api.cache && api.cache.never();
    // Extract some environment variables.
    const NODE_ENV = process.env.NODE_ENV || 'development';
    // Determine the current environment.
    const isEnvDevelopment = NODE_ENV === 'development';
    const isEnvProduction = NODE_ENV === 'production';
    const isEnvTest = NODE_ENV === 'test';
    // Define the plugins for babel.
    const plugins = [
        // Necessary to include regardless of the environment because
        // in practice some other transforms (such as object-rest-spread)
        // don't work without it: https://github.com/babel/babel/issues/7215
        require('@babel/plugin-transform-destructuring').default,
        // Turn on legacy decorators.
        [
            require('@babel/plugin-proposal-decorators').default,
            {
                decoratorsBeforeExport: true
            }
        ],
        // class { handleClick = () => { } }
        // Enable loose mode to use assignment instead of defineProperty
        // See discussion in https://github.com/facebook/create-react-app/issues/4263
        [
            require('@babel/plugin-proposal-class-properties').default,
            {
                loose: true
            }
        ],
        // The following two plugins use Object.assign directly, instead of Babel's
        // extends helper. Note that this assumes `Object.assign` is available.
        // { ...todo, completed: true }
        [
            require('@babel/plugin-proposal-object-rest-spread').default,
            {
                useBuiltIns: true
            }
        ],
        // Polyfills the runtime needed for async/await, generators, and friends
        // https://babeljs.io/docs/en/babel-plugin-transform-runtime
        [
            require('@babel/plugin-transform-runtime').default,
            {
                corejs         : false,
                helpers        : true,
                regenerator    : true,
                // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
                // We should turn this on once the lowest version of Node LTS
                // supports ES Modules.
                // useESModules   : false,
                useESModules   : isEnvDevelopment || isEnvProduction,
                // Undocumented option that lets us encapsulate our runtime, ensuring
                // the correct version is used
                // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
                absoluteRuntime: path.dirname(require.resolve('@babel/runtime/package.json'))
            }
        ],
        isEnvProduction && [
            // Remove PropTypes from production build
            require('babel-plugin-transform-react-remove-prop-types').default,
            {
                mode: 'wrap'
            }
        ],
        // Adds syntax support for import()
        require('@babel/plugin-syntax-dynamic-import').default,
        // Transform dynamic import to require.
        isEnvTest && require('babel-plugin-dynamic-import-node'),
        [
            // Add support for styled components.
            require('babel-plugin-styled-components').default,
            {
                // For better debugging.
                displayName              : true,
                // Control the component's displayName.
                fileName                 : true,
                // Enable minification support.
                minify                   : true,
                // Dead code elimination.
                pure                     : true,
                // Template string transpilation for a smaller code footprint.
                transpileTemplateLiterals: true
            }
        ],
        [
            // Custom module resolver for babel,
            // provides cleaner import statements.
            // Instead of:
            //      import AppNav from '../../../components/AppNav';
            // we can now write:
            //      import AppNav from 'components/AppNav'
            require('babel-plugin-module-resolver').default,
            {
                // Set the root directory to `src`,
                // this way all immediate sub-directories can be used in import statements directly.
                root: ['./src']
            }
        ]
    ].filter(Boolean);
    // Define the presets for babel.
    const presets = [
        isEnvTest && [
            // ES features necessary for user's Node version.
            require('@babel/preset-env').default,
            {
                targets: {
                    node: 'current'
                }
            }
        ],
        (isEnvProduction || isEnvDevelopment) && [
            // Latest stable ECMAScript features.
            require('@babel/preset-env').default,
            {
                // Let's be compatible with IE 9 until React itself no longer works with IE 9.
                targets: {
                    ie: 9
                },
                // We're tuning this Babel config for ES5 support.
                ignoreBrowserslistConfig: true,
                // If devs import all core-js they're probably not concerned with
                // bundle size. We shouldn't rely on magic to try and shrink it.
                useBuiltIns             : false,
                // Do not transform modules to CJS.
                modules                 : false,
                // Exclude transforms that make all code slower.
                exclude                 : ['transform-typeof-symbol']
            }
        ],
        [
            require('@babel/preset-react').default,
            {
                // Adds component stack to warning messages.
                // Adds __self attribute to JSX which React will use for some warnings.
                development: isEnvDevelopment || isEnvTest,
                // Will use the native built-in instead of trying to polyfill
                // behavior for any plugins that require one.
                useBuiltIns: true
            }
        ]
    ].filter(Boolean);
    // Return the plugins and presets from this func invocation.
    return {
        plugins,
        presets
    };
}

module.exports = configureBabel;
