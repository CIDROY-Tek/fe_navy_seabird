// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      title: 'LMS',
      titleTemplate: 'LMS - %s',
    }
  },


  // vuetify
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
    "~/assets/global.scss",
    "~/assets/css/common.css"
  ],
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },

  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  routeRules: {
    '/api_base/**': { proxy: { to: process.env.BASE_URL + "/**" } }
  },
})
