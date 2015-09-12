/**
* @license JGMM 
* * License: MIT
*/
(function(window, angular, undefined) {'use strict';

  angular.module('ngAccess', ['ng'])
  .controller('NavController',navControlFunc)
  .controller('MainNavController',mainNavControlFunc)
  .directive('mainAccessMenu',DirectiveMainFunc)
  .directive('mainAccessSubmenu',DirectiveSubFunc)//directive for the submenu interaction;
  .directive('asyncSubmenu',AsyncSubmenuFunc);//directive for the submenu call async 
  function AsyncSubmenuFunc(){
    var directive={
      restrict: 'A',
      link: linkFunction,
      require:'^mainAccessMenu'
    }
    function linkFunction(scope, element, attrs, mainAccessMenu){
      //events for the main menu item
      var mainConfig={
        MainItem:element[0].parentElement,
        mainItemSelector:".nav-item",
        SubmenuSelector:".Sub-Menu",
        SubmenuItemSelector:".subnav-item"
      };
      // re attach the events  after the async menu comes
      mainAccessMenu.attachEvents(scope.vmm.eventMainHandler,"onkeydown",mainConfig);
    }
    return directive;
  }
  function  mainNavControlFunc(){
          var vmm=this;
          //take an array of DOM elements and attach an event to them
          vmm.attachEvents=function(callback,event,config){
            var i,menuArray=[];
            var mainItems=config.MainItem.querySelectorAll(config.mainItemSelector);
            //loop throught all the elements
            for(i=0;i<mainItems.length;i++){
              //look for the first link of the sub menu and add it to the DOM element Object
              var firstLink=mainItems[i].parentNode.querySelector(config.SubmenuSelector);
              mainItems[i].firstLink = firstLink.querySelector(config.SubmenuItemSelector); //submenu added as a part of DOM Element
              mainItems[i].subMenu = firstLink; //first menu item added as a part of DOM Element
              menuArray[i] = mainItems[i]; /* save the mainItems element in the array */
              menuArray[i][event] = callback.call(this,i,menuArray,config.mainItem);
            }
          };
          vmm.clearAllHover=function(items){
          var i;
            for(i=0;i<items.length;i++){
            items[i].classList.remove("isHover");
            }
          }
          vmm.clearSubmenu=function(items,index){
           for(var i=0;i<items.length;i++){
             items[i].subMenu.classList.remove("visible"); //hide all of the sub menus
           }
           if(index){ //index given return the focus
            items[i].focus();
           }
          };
          vmm.eventMainHandler=function(i,menuArray,elem){
          return function(e){
          if(e.keyCode===39){ 
            vmm.clearAllHover(menuArray);
            //right differents options with the right arrow
            vmm.clearSubmenu(menuArray);
            if((menuArray.length - 1)===i){
              //"the last item in the group go to the focus parent"
            }
            else{
              menuArray[i+1].focus(); //move focus right
            }
          return false;
          }
          else if(e.keyCode===13){
            //enter key
            vmm.clearSubmenu(menuArray);
            var subMenu=menuArray[i].subMenu,firstLink=menuArray[i].firstLink;
            if(subMenu && firstLink){ // if not is a one level menu
              menuArray[i].classList.add("isHover");
              subMenu.classList.add("visible");
              firstLink.focus();
            }
            return false;
          }
          //move focus left sending the parent as an argument and this element
          else if(e.keyCode===37){
            // left
            vmm.clearSubmenu(menuArray);
            vmm.clearAllHover(menuArray);
            if(i===0){
              //"es el ultimo de la fila ve al foco del padre"
            }
            else{
              menuArray[i-1].focus(); //move focus right
            }
            return false;
          }
          //up
          else if(e.keyCode===38 ){
            vmm.clearSubmenu(menuArray);
            menuArray[i].classList.remove("isHover");
            return false;
            // up diferent options with the up arrow
            // no hay eventos en el app del menu principal
          }
          //move focus down sending the parent as an argument and this element
          else if(e.keyCode===40 || e.keyCode=== 32){
            //down arrow
            vmm.clearSubmenu(menuArray);
            var subMenu=menuArray[i].subMenu,firstLink=menuArray[i].firstLink;
            if(subMenu && firstLink){ // if not is a one level menu
              menuArray[i].classList.add("isHover");
              subMenu.classList.add("visible");
              console.log(firstLink);
              firstLink.focus();
            }
            return false;
          }
          else if(e.keyCode===27){
            // clear all the sub items and send the focus of the target
            vmm.clearSubmenu(menuArray);
            menuArray[i].classList.remove("isHover");
            return false;
          }
          else{
            // debug the key pressed  
          }
        };
          }
  }
  function DirectiveMainFunc(){
  var directive= {
      restrict: 'A',
      link: linkFunction,
      controller:'MainNavController',
      controllerAs:'vmm',
      bindToController: true,
    };
    function linkFunction(scope, element, attributes){
      //events for the main menu item
      var mainConfig={
        MainItem:element[0],
        mainItemSelector:".nav-item",
        SubmenuSelector:".Sub-Menu",
        SubmenuItemSelector:".subnav-item"
      };
      // attach events to the selectors 
      scope.vmm.attachEvents(scope.vmm.eventMainHandler,"onkeydown",mainConfig);
    }
    return directive;
  }
  function DirectiveSubFunc(){
    var directiveReturn= {
      restrict: 'A',
      controller:'NavController',
      controllerAs:'vm',
      bindToController: true,
      link: linkFunction
    };

    function linkFunction(scope, element, attributes){
      //events for the main menu item
      var sectionConfig={
        actualSection:element[0],
        subNavGroup:".sub-nav-group",
        subNavItem:".subnav-item"
      };
      // attach events to the selectors 
      scope.vm.attachEvents(eventHandler,"onkeydown",sectionConfig);
      function eventHandler(i,j,menuMatrix,subElem){
        return function(e){
          if(e.keyCode===39){ 
            //right differents options with the right arrow
            if((menuMatrix.length - 1)===i){
             //the last item in the group go to the focus parent"
            }
            else{
              menuMatrix[i+1].subItems[0].focus(); //move focus right
            }
          }
          //move focus left sending the parent as an argument and this element
          else if(e.keyCode===37){
            // left
            if(i===0){
              //es el ultimo de la fila ve al foco del padre"
            }
            else{
              menuMatrix[i-1].subItems[0].focus(); //move focus right
            }
          }
          //move focus down sending the parent as an argument and this element
          else if(e.keyCode===38){ 
            // up diferent options with the up arrow
            if(i===0 && j===0){
              menuMatrix[i].subItems[j].ParentItemMenu.focus();
            }
            //Move to the previus item group
            else if(j===0){
              //capture the previus group and the length of the sub items
              var previusGroup=menuMatrix[i-1],previusLength=previusGroup.subItems.length;
              //set the focus to the previus element and last sub item
              previusGroup.subItems[previusLength-1].focus();
            }
            //Normal Move to the up item
            else{
              menuMatrix[i].subItems[j-1].focus(); //move focus right
            }
            return false;
          }
          //move focus up sending the parent as an argument and this element
          else if(e.keyCode===40){
            if(((menuMatrix.length - 1)===i) && ((menuMatrix[i].subItems.length - 1)===j)){
              //"ve al siguiente sub menu"
            }
            else if((menuMatrix[i].subItems.length - 1)===j){
              //capture the previus group and the length of the sub items
              var nextGroup=menuMatrix[i+1];
              //set the focus to the previus element and last sub item
              nextGroup.subItems[0].focus();
            }
            else{
              menuMatrix[i].subItems[j+1].focus(); //move focus right
            }
            return false;
          }
          else if(e.keyCode===27){
            // clear all the sub items and send the focus of the target
            
            subElem.classList.remove("visible");
            var parentItem= menuMatrix[i].subItems[j].ParentItemMenu;
            parentItem.focus();
            parentItem.classList.remove("isHover");
          }
          else if(e.keyCode===13){
            //else if enter is pressed
            menuMatrix[i].subItems[j].click();
            subElem.classList.remove("visible");
          }
         else{
            return true;
          }
        };
      }
    }
    //return the literal object
    return directiveReturn;
  }
  function navControlFunc(){
    var vm=this;
    //take an array of DOM elements and attach an event to them
    vm.attachEvents=function(callback,event,config){
      var i,j,menuMatrix=[];
      var menuItemParent=config.actualSection.previousElementSibling;
      var subGroups=config.actualSection.querySelectorAll(config.subNavGroup);
      //loop throught all the elements
      for(i=0;i<subGroups.length;i++){
        menuMatrix[i]=subGroups[i]; /* save the subGroup element in the matrix */
        var subItem=subGroups[i].querySelectorAll(config.subNavItem);
        menuMatrix[i].subItems=subItem; /*save the subItem in the matrix */
        for(j=0;j<subItem.length;j++){
        //add reference to the next menu and previus submenu
        //reference to the parent item added to the submenu element
        subItem[j].ParentItemMenu=menuItemParent;
        //send the elems as a matrix [i,j] where i is the subGroup position and J is the sub Item position 
        subItem[j][event]=callback.call(this,i,j,menuMatrix,config.actualSection);
        }
      }
    };
  }
})(window, window.angular);