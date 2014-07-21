$(".floor1-button").click ->
  $("#floor1").css "visibility", "visible"
  $("#floor1").css "display", "inline-block"
  $("#floor2").css "visibility", "hidden"
  $("#floor2").css "display", "none"
  $("#floor3").css "visibility", "hidden"
  $("#floor3").css "display", "none"
  $("#floor4").css "visibility", "hidden"
  $("#floor4").css "display", "none"
  $("#floor5").css "visibility", "hidden"
  $("#floor5").css "display", "none"
  return

$(".floor2-button").click ->
  $("#floor1").css "visibility", "hidden"
  $("#floor1").css "display", "none"
  $("#floor2").css "visibility", "visible"
  $("#floor2").css "display", "inline-block"
  $("#floor3").css "visibility", "hidden"
  $("#floor3").css "display", "none"
  $("#floor4").css "visibility", "hidden"
  $("#floor4").css "display", "none"
  $("#floor5").css "visibility", "hidden"
  $("#floor5").css "display", "none"
  return

$(".floor3-button").click ->
  $("#floor1").css "visibility", "hidden"
  $("#floor1").css "display", "none"
  $("#floor2").css "visibility", "hidden"
  $("#floor2").css "display", "none"
  $("#floor3").css "visibility", "visible"
  $("#floor3").css "display", "inline-block"
  $("#floor4").css "visibility", "hidden"
  $("#floor4").css "display", "none"
  $("#floor5").css "visibility", "hidden"
  $("#floor5").css "display", "none"
  return

$(".floor4-button").click ->
  $("#floor1").css "visibility", "hidden"
  $("#floor1").css "display", "none"
  $("#floor2").css "visibility", "hidden"
  $("#floor2").css "display", "none"
  $("#floor3").css "visibility", "hidden"
  $("#floor3").css "display", "none"
  $("#floor4").css "visibility", "visible"
  $("#floor4").css "display", "inline-block"
  $("#floor5").css "visibility", "hidden"
  $("#floor5").css "display", "none"
  return

$(".floor5-button").click ->
  $("#floor1").css "visibility", "hidden"
  $("#floor1").css "display", "none"
  $("#floor2").css "visibility", "hidden"
  $("#floor2").css "display", "none"
  $("#floor3").css "visibility", "hidden"
  $("#floor3").css "display", "none"
  $("#floor4").css "visibility", "hidden"
  $("#floor4").css "display", "none"
  $("#floor5").css "visibility", "visible"
  $("#floor5").css "display", "inline-block"
  return
