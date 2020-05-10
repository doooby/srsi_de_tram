# frozen_string_literal: true

module Lib
  class InProcessStore

    def initialize
      @index = {}
      @lock = Concurrent::ReadWriteLock.new

      @queries = {}
      @referenced_by = []
      @triggers = {}
    end

    def read
      @lock.with_read_lock do
        yield @index
      end
    end

    def get id
      read do |index|
        index[id]
      end
    end

    def find &block
      read do |index|
        index.values.find(&block)
      end
    end

    def select &block
      read do |index|
        index.values.select(&block)
      end
    end

    def add object
      write do
        raise 'non-unique ID' if @index.key? object.id

        @index[object.id] = object
      end
    end

    def remove object
      write do
        @index.delete object.id
        invoke_trigger :on_removed, object
      end
    end

    def clear
      write do
        @index.clear
      end
    end

    def define_query name, &block
      @queries[name] = block
    end

    def query name, *args
      action = @queries[name] || return
      @lock.with_read_lock do
        action.call @index, *args
      end
    end

    def reference_by store, **triggers
      @referenced_by.push store
      triggers.each{|name, action| @triggers[name] = action }
    end

    def invoke_trigger name, arg
      @triggers[name]&.call arg
    end

    private

    def write
      @lock.with_write_lock do
        yield @index
      end
    end

  end
end
