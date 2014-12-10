//= require jquery
//= require jquery_ujs
//= require bootstrap

var a=$('ul.vertical-nav a');
for(var i=0;i<a.length;i++)
{
    a[i].onclick=function()
    {
        window.location=this.getAttribute("href");
        return false
    }
}