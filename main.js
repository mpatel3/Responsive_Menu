/**
 * Define Constants.
 */
let menuTemplateString = ``;
const navItemWidth = 140;

/**
 * Intlialize require things.
 */
document.addEventListener("DOMContentLoaded",()=>{
    let xmlhttp;

    if (window.XMLHttpRequest) {
        // code for modern browsers
        xmlhttp = new XMLHttpRequest();
     } else {
        // code for old IE browsers
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    loadMenuData(xmlhttp); // load data using API to render.
    self.menuWrapper = document.querySelector("#wrapper_menu_nav"); // get reference of the menu wrapper.
});

/**
 * @description: This method will call for an API and get all the data.
 * @param : xmlhttp - Ajax Object to make an API call.
 */
loadMenuData = (xmlhttp) => {
    
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           self.menuData = JSON.parse(this.response); // create reference.
           renderData(); // render data in Menu
        }
    };
    xmlhttp.open("GET", "data.json", true);
    xmlhttp.send();
}

/**
 * @description : This function will create a template-string to render all the data in View.
 * @param: menuData : all the JSON data for menu.
 * @return: nothing.
 */

createTemplateString = (menuData) => {
    
    //loop over menu data
    menuData.forEach(function(singleMenuNode){
        // break condition.
        if(singleMenuNode.childNodes == undefined || singleMenuNode.childNodes.length == 0) {
            menuTemplateString += `<li><a href="#">${singleMenuNode.menuName}</a></li>`
            return false;
        }
        
        // Looping condition.
        if(singleMenuNode.childNodes.length > 0) {
            menuTemplateString += `<li><a href="#">${singleMenuNode.menuName} <span class="look-for-more">&#8897;</span></a><ul class="hidden">`
            createTemplateString(singleMenuNode.childNodes);
            menuTemplateString += `</ul></li>`
        }

    });
}

/**
 * @description : function will call every time when window screen is being resized. 
 */
onWindowResize = () => {
    menuTemplateString = ''; // reset template string.
    self.menuWrapper.innerHTML = ''; // reset view
    renderData(); // again render data.
}

/**
 * @description : Function will decide how many items will require to be displayed before dropdown based on the screen size, NavItems available.
 * @description: Function first will decide how much they can accomodate, then they will create template string and then render into View.
 */
renderData = () => {
   
    const totalTopLevelNavLinks = self.menuData.length; // total nodes. 
    const minRequireScreenWidth = Number(self.menuData.length * navItemWidth) // what is minimum screen size will going to require if user wants accomodate all in single line.
    let screenWidth = Number(window.innerWidth.toString().replace('/px/','')); // get screen size.
    
    /**
     * IF require width for total nav items is adjustable OR user is on mobile device then render all data.
     */
    if(minRequireScreenWidth < screenWidth || screenWidth < 551 ) {
        //render all data
        createTemplateString(self.menuData);
        self.menuWrapper.innerHTML = menuTemplateString;
    } else {

        const itemCanBeRendered = screenWidth / 140; // No of items can be accomodated.
        const RoundValue = Math.round(itemCanBeRendered); // Round value.
        const moreLinkWidth =  Number(screenWidth - ((RoundValue - 1) * navItemWidth)) - (RoundValue + 1); // calculate width for the 'More' link which will displayed in the end.
        
        // check items are less then total
        if(itemCanBeRendered < totalTopLevelNavLinks) {
            createTemplateString(self.menuData.slice(0,RoundValue - 1)); // create template string for first half.
            
            // add more link 
            menuTemplateString += `<li class="drop-down-menu"><a style="width: ${moreLinkWidth}px !important" href="#">More <span class="look-for-more">&#8897;</span></a><ul class="hidden">`;
           
            createTemplateString(self.menuData.slice(RoundValue-1,totalTopLevelNavLinks+1)); // create tempalte string for second half.

            //render in HTML
            self.menuWrapper.innerHTML = menuTemplateString;
            
        }
    }
}