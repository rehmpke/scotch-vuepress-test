Skip to content
 
Search or jump to…

Pull requests
Issues
Marketplace
Explore
 @rehmpke Sign out
0
24 31 Chuloo/scotch-vuepress
 Code  Issues 0  Pull requests 0  Projects 0  Wiki  Insights
scotch-vuepress/docs/.vuepress/config.js
6cf0ff1  on Apr 16
@Chuloo Chuloo initial commit
     
27 lines (27 sloc)  666 Bytes
module.exports = {
    title: 'Scotch VuePress',
    description: "A demo documentation using VuePress",
    themeConfig:{
        nav: [
            { text: 'COUNTER', link: '/counter/' },
            { text: 'GUIDE', link: '/guide/' },
        ],
        sidebar: [
            {
              title: 'Counter',
              collapsable: false,
              children: [
                '/counter/counter-app'
              ]
            },
            {
              title: 'API Guide',
              collapsable: false,
              children: [
                  '/guide/guide',
                  '/guide/api'
              ]
            }
          ]
    }
}
© 2018 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
API
Training
Blog
About
Press h to open a hovercard with more details.