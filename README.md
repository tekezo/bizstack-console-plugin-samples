# Plugin Template
This document contains instruction on how to create plugins for BizConsole. This directory also contain templates for different types of
Plugin.

## Requirements
Because `@moderepo/biz-console` package is published to Github, not NPM, you will need to create an Access Token from Github and log into
npm with that token.
- Create an Access Token here https://github.com/settings/tokens. Since you only need permission to install `@moderepo/biz-console` in your
project, you will only need `read:packages` access.
- Then login into npm and tell it which registry you want it to use to find packages with this command
    ```
    $ npm login --registry=https://npm.pkg.github.com
    > Username: USERNAME
    > Password: TOKEN
    > Email: PUBLIC-EMAIL-ADDRESS
    ```
    USERNAME is your Github username and use the token you generated as password. For more information see https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages

## Create a project for the plugin using Vite
### Create a new project
- Run `npx create-vite my_widget`
- Choose `React` (Or choose other framework)
- Choose `Typescript`

### Install required libraries
- Run `npm i -D @moderepo/biz-console` to install `@moderepo/biz-console`
- Run `npm i -D @originjs/vite-plugin-federation` to install Module Federation plugin for Vite since we are using Vite instead of Webpack
- Run `npm i zustand` to install Zustand.
- Install Material UI
  - This step is only required if the plugin needs to use MUI. Technically, the plugin can use any CSS library. However, to have the
    plugin UI integrate smoothly with BizConsole, it is recommended that the plugin also use MUI. To install MUI, please follow the instruction
    [here](https://mui.com/material-ui/getting-started/installation/). Note that MUI recommend using @emotion style engine. However, if
    you want to use styled-component, please follow the instruction on how to use styled-component style engine. Also, using styled-component
    style engine will require additional setup. Please look at the example plugin's `tsconfig.json` and `vite.config.ts` for example.
- Install other libraries as needed e.g. eslint, prettier, etc...

### Delete unnecessary files (Optional)
Because we use Vite to create a new React project, it will automatically create a simple app with a welcome page. Since this is a Plugin
project, we don't need most of these files therefore we can clean up by deleting them. These are some of the files that can be deleted. Note
that this step is optional.
- src/App.tsx
- src/App.css
- src/index.css
- src/main.tsx
- src/vite-env.d.ts
- index.html (You might need to create a blank index.html to get around a compile error because of missing index.html)

## Configure the project
### Update `vite.config.ts`
- Configure the port number to use. This is optional but it is easier to test the plugin if we use a specific port so that we don't need to
update the config every time the port number change. In this example, we will use port 5000 but any unused port number works.

  ```
    export default defineConfig({
        server: {
            port: 5000,
        },
        preview: {
            port: 5000,
        },
        plugins: [...]
    }
  ```

- Configure the `build` option
  ```
    export default defineConfig({
        ...,
        build: {
            // This is important. It tells the compiler to generate the Javascript code that use the latest Javascript features
            target: 'esnext',

            // This is important. This will make the compiler not generate the style file. Having the style file
            // loaded with the module will break BizConsole's style
            cssCodeSplit: true,

            minify: true,
        },
    })
  ```

- Configure the Module Federation plugin. We will use one of the plugins for example. You will need to modify this config accordingly
based on the plugin that you are building.
  ```
    export default defineConfig({
        ...,
        plugins: [
            react(),
            federation({
                name: 'Weather Widget',

                // The plugin entry file name of the file to be generated by the build script
                filename: 'weatherWidget.js',

                // Modules to expose
                exposes: {
                    './weatherWidget': './src/weather-widget/WeatherWidget',
                },

                shared: ['react', 'react-dom', '@mui/material', 'zustand', '@moderepo/biz-console']
            })
        ],
        ...
    })
  ```

- Configure the resolve settings (This is only needed if MUI and styled-component is used)
  ```
    export default defineConfig({
        ...
        resolve: {
            alias: {
                // Because we use styled-component instead of Emotion, we need to tell the complier where to find the styled engine
                // when there is an import at '@mui/styled-engine'
                '@mui/styled-engine': '@mui/styled-engine-sc',
            },
        },
        ...
    })
  ```

  ## Implement the plugin
  - Create a directory under the `src` directory where all the files for the plugin will be stored. This is not needed but doing this will keep
  the code clean if the `src` directory have other files. So based on the example we used in the previous section, we will create a directory
  name `weather-widget`.
  
  ### Create files for the plugin
  What files you need to create will depend on the type of widget you are creating. Technically, you can put everything into 1 file but it would
  be cleaner to separate the files. Below is the recommendation but you don't need to do exactly the same

  #### Files for Dashboard Widget plugins
  - `utils.ts`
    This file is where we place all util/helper functions, constants, etc...
  - `models.ts`
    This file is where we place the models for the widget e.g. the widget's customSettings mode and other models that the widget needs.
  - `schema.ts`
    This file is where we define the setting schema to be used for creating the widget's settings UI.
  - `[ComponentName].tsx`
    This is where the component/widget code should be placed.
  - `styled.tsx`
    This is where we place the styled components to style the widget

  #### Files for Component plugins
  The same as dashboard widget plugins

  #### File that ALL plugins package should have.
  - `config.ts`
    This file is the most important file. It is the entry point to the plugins and will be loaded by BizConsole. This file is where we place
    the configuration for the plugins. In this file, there must be a variable called `bizConsolePlugins` and it must be an Object. Inside this
    object must contain an Array of plugins definition. The array can contain 1 or more plug in definitions and the definitions can be for
    different types of plugins. This allows 1 plugin package to implement multiple plugins.

## Test the plugin
### Host the plugin locally
- Run `npm run build` to build the plugin. This will generate Javascript files under the `/dist/assets` directory.
- Run `npm run preview` to run a web server where the plugin will be hosted LOCALLY. Now the plugin's code should be accessible at this URL
http://localhost:5000/assets/weatherWidget.js based on the configuration we use in this doc. Change this URL accordingly based on your config. 

### Configure project's app config
- Go to DEV console on one of the environment that you need to use (DEV, STAGE, or PROD). And then go to the project you want to add the plugin to
  ![Dev Console App Config](./assets/project_app_config.png)
- Go to the `Apps` settings and select `biz-console`
- Edit the `CUSTOM CONFIGURATION OBJECT`. Enter this JSON.
  ```
    {
        ..., // other app settings e.g. Drawer menu, translation, etc...

        "plugins": [
            {
                // The name of the plugin. This is used by Module Federation to manage the remote modules.
                "name": "WeatherWidget"

                // This tells BizConsole where to download the plugin. Since we are testing it locally, the URL will be
                // http://localhost.
                "url": "http://localhost:5000/assets/weatherWidget.js",

                // This tells BizConsole the name of the module to look for. This name is the same name as the one specified in the
                // vite.config.ts's `exposes`
                "exposedModuleName": "weatherWidget",
            }
        ],
    }
  ```

  ### Try using the plugin in BizConsole
  - Go to BizConsole and go to any dashboard. And then go into Edit dashboard mode.
  - Click on `Add Widget` and you will see the new widget appear in the list of widgets. NOTE that only you can see the widget because this
  is running locally on your computer. Other users will not see the widget.
    ![Select Widget](./assets/add_widget.png)
  - Configure the widget
    ![Configure Widget](./assets/configure_widget.png)
  - Check out the widget on the dashboard and verify if everything look good
    ![Weather Widget Preview](./assets/weather_widget_preview.png)

  ### Fix and update the plugin
  If you find any issue with the plugin and need to make changes, go back to the code and make changes. Once you are done with the changes and
  want to test the widget again, re-run `npm run build` again. If the server is still running then you don't need to start the server again. If
  not, run `npm run preview` again

  ### Deploy the plugin
  When the widget is completed and ready to be used by other, you can deploy everything in the `dist/` directory to some public server. How you
  can do this is up to you. Because the code is static, you can just use any CDN e.g. AWS S3. Once the code is deployed and you have the URL
  to the files, go back to DEV console and update the plugin config. Replace the `url` from http://localhost:5000/assets/weatherWidget.js to
  the URL of the server where you deployed the plugin to.

  ### Verify the widget in BizConsole
  Because the plugin's entry URL has been changed, you need to go back to BizConsole to make sure the widget is still working. If you don't see the
  widget anymore, it is probably because the `url` is invalid.
  And since the plugin is now hosted on a public server, other users using this project should also be able to use the widget. You can verify this
  by having someone from another computer access the dashboard.
