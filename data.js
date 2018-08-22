module.exports = [
    {
        description: 'Enter username',
        type: 'type',
        selector: '#username',
        data: 'fftestff2@sina.com',
        visible: true
    },
    {
        description: 'Enter password',
        type: 'type',
        selector: '#password',
        data: 'Password1!',
        visible: true
    },
    {
        description: 'Click "Sign In" Button',
        type: 'click',
        selector: '#submit',
        visible: true,
        navigation: true
    },
    {
        description: 'Check "Select a customer" page exist',
        type: 'evaluate',
        selector: 'body > div.ng-isolate-scope.cwc-isolate-navbar > div > div > div > div > div > div > div > div',
        delay: 1000
    },
    {
        description: 'Select a customer if exist multiple customers',
        type: 'click',
        selector: 'body > div.ng-isolate-scope.cwc-isolate-navbar > div > div > div > div > div > div > ctx-scroll-select > div > div > ctx-scroll-select-item:nth-child(10) > div > span',
        hasLastElement: true,
        navigation: true
    },
    {
        description: 'Check whether has Pendo Welcome dialog',
        type: 'evaluate',
        selector: '#_pendo-close-guide_',
        delay: 2000,
        hidden: true
    },
    {
        description: 'Click XenApp "Manage" Button',
        type: 'click',
        selector: 'body > ctx-app > div > ctx-shell > div > ctx-dashboard > div > ctx-dashboard-services > div > div.ctx-dashboard-services-my-services.ng-star-inserted > ctx-dashboard-services-group > div > div.ctx-dashboard-services-group-content > ctxgrid > div > div:nth-child(12) > ctxgridtile > div > div > ctx-dashboard-services-tile > div > div.ctx-dashboard-services-tile-inner > div.ctx-dashboard-services-tile-inner-button.ng-star-inserted > ctx-spinner-2 > div > div',
        visible: true,
        delay: 1000,
        navigation: true
    },
    {
        description: 'Click "Manage" button in XenApp Service',
        type: 'click',
        selector: 'body > app > navbar > div > div > ul.xd-navbar-left.xd-navbar-color-light > li:nth-child(2) > a.ng-tns-c1-0.has-dropdown',
        visible: true
    },
    {
        description: 'Check whether has Pendo dialog',
        type: 'evaluate',
        selector: 'body > modal-container > div > div > ng-component > div.modal-footer.pull-left > button.ctx-button.ml-0',
        delay: 20000,
        hidden: true
    },
    {
        description: 'Click right-top dropdown menu',
        type: 'click',
        selector: '#username-admin-display-name > div.username-row.admin-name.ng-binding',
        delay: 3000,
        visible: true
    },
    {
        description: 'Click sign out menu to logoff',
        type: 'click',
        selector: 'body > cwc-navbar > div > div > div.pull-right > div.username-container.vmid.XenApp.and.XenDesktop.Service > div > div > div > div.cwc-dropdown-menu.username-menu.XenApp.and.XenDesktop.Service > div:nth-child(4) > a > span',
        delay: 1000,
        visible: true,
        navigation: true
    }
]