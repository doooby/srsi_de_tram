# frozen_string_literal: true

module Application
  class Board
    
    attr_reader :id

    def initialize owner
      @id = Application.generate_object_id
      @owner = owner
      @connections = []
      # @lost_connections = []
    end

    def enter conn
      if @connections.include? conn
        true

      elsif conn.id == @owner.id
        add_connection! conn
        true

      elsif @connections.length < Application::BOARD_MAX_CONNECTIONS
        add_connection! conn
        true

      else
        false

      end
    end
    
    def leave conn
      @connections.delete conn
    end

    # def kick req_conn, to_kick
    #   @connections.delete to_kick if req_conn.id == @owner.id
    # end

    def has_active_connection? connection
      @connections.index connection
    end

    def on_connection_lost connection
      # @lost_connections.push connection
      @connections.delete connection
    end

    def broadcast_message *args
      raw_data = Connection.generate_raw_msg(*args)
      LOGGER&.info "[BOARD] Broadcast | #{id} | <<"
      LOGGER&.info raw_data

      @connections.each do |connection|
        connection.pass_raw_msg raw_data
      end
      raw_data
    end

    def status
      {
          id: id,
          owner: owner.id,
          present: @connections.map(&:id),
          # lost: @lost_connections.map(&:id),
      }
    end

    private

    def add_connection! conn
      if @connections.length >= Application::BOARD_MAX_CONNECTIONS
        raise "Board[#{id}] is full - cannot accept #{conn.id}"
      end

      @connections.push conn
    end

    class << self

      attr_reader :store

    end

    @store = Lib::InProcessStore.new.tap do |store|

      Connection.store.reference_by store,
          on_removed: -> (conn) {
            Board.store.
                select{|b| b.has_active_connection? conn }.
                each{|b| b.on_connection_lost conn }
          }

    end

  end
end
