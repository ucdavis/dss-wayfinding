class BuildCaches
  def perform
    output = `node nodejs/buildCaches.js &`
    logger.debug "[[[[[[[[[[[[[[[[[ #{output} ]]]]]]]]]]]]]]]]]"
  end
end