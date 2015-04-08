class RssFeedsController < AdministrationController
  before_action :set_rss_feed, only: [:destroy]

  # POST /rss_feeds
  def create
    @rss_feed = RssFeed.new(rss_feed_params)

    respond_to do |format|
      if @rss_feed.save
        format.html { redirect_to administration_index_url, notice: 'RSS feed successfully added.' }
        format.json { render json: { notice: 'RSS feed successfully added' } }
      else
        format.html { redirect_to administration_index_url }
        format.json { render json: { notice: 'Could not add RSS feed' } }
      end
    end
  end

  # DELETE /rss_feeds/1
  def destroy
    @rss_feed.destroy
    respond_to do |format|
      format.html { redirect_to rss_feeds_url, notice: 'Rss feed was successfully destroyed.' }
      format.json { render json: { notice: 'Rss feed was successfully destroyed.' } }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_rss_feed
      @rss_feed = RssFeed.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def rss_feed_params
      params[:rss_feed].permit(:url)
    end
end
