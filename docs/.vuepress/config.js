module.exports = {
    title: 'Roger Developer Notes',
    description: "A demo documentation using VuePress",
    markdown: {
        extendMarkdown: md => {
            md.set({ breaks: true})
            md.use(require('markdown-it-xxx'))
        }
    },
    themeConfig:{
        nav: [
            { text: 'GUIDE', link: '/guide/' },
            { text: 'jekyll', link: '/jekyll/' },
        ],
        sidebar: [
            {
              title: 'Frontend Developer Guide',
              collapsable: false,
              children: [
                  '/guide/Frontend web developer'
                ]
            },
            {
                title: 'Jekyll Guide',
                collapsable: false,
                children: [
                    '/jekyll/Jekyll with free SSL on Digitalocean',
                    '/jekyll/My Jekyll Development process'
              ]
            }
          ]
    }
}