const body = $("body");
const radio1 = $("#rd-theme1");
const radio2 = $("#rd-theme2");
const radio3 = $("#rd-theme3");

// THEME-BUTTON EVENT LISTENER
radio1.click(() => {
    $(body).removeClass();
    $(body).addClass("theme1");
    localStorage.setItem("theme", "1")
})

radio2.click(() => {
    $(body).removeClass();
    $(body).addClass("theme2");
    localStorage.setItem("theme", "2")
})

radio3.click(() => {
    $(body).removeClass();
    $(body).addClass("theme3");
    localStorage.setItem("theme", "3")
})

const localThemePreference = localStorage.getItem("theme")
if(localThemePreference == "2") {
    $(body).removeClass();
    $(body).addClass("theme2");
    $(radio2)[0].checked = true
} else if(localThemePreference == "3") {
    $(body).removeClass();
    $(body).addClass("theme3");
    $(radio3)[0].checked = true
} else {
    $(body).removeClass();
    $(body).addClass("theme1"); 
}