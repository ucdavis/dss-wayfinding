$(document).ready ->
  received = getCookie("start")
  $('.start').val(received)

  $('.submit-start').click () ->
    submitted = $('.start').val()
    setCookie("start", submitted) 

setCookie = (cookieName, cookieValue) ->
   expire = new Date("2025-01-01 12:00:00")
   document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString()
   setval = document.cookie

getCookie = (name) ->
  nameEQ = name + "="
  ca = document.cookie.split(";")
  i = 0
  while i < ca.length
    c = ca[i]
    c = c.substring(1, c.length)  while c.charAt(0) is " "
    return c.substring(nameEQ.length, c.length)  if c.indexOf(nameEQ) is 0
    i++
  null
