# frozen_string_literal: true

module Lib
  class InProcessStore

    def initialize
      @index = {}
      @lock = Concurrent::ReadWriteLock.new

      @queries = {}
      @cache = {}
      @cacheable = {}

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
        @cache.clear
      end
    end

    def clear_cache
      @cache.clear
    end

    def define_query name, cacheable: false, &block
      @queries[name] = block
      @cacheable[name] = cacheable
    end

    def query name
      cacheable = @cacheable[name]
      if cacheable
        result = @lock.with_read_lock{ @cache[name] }
        return result unless result.nil?
      end

      action = @queries[name] || return
      result = read(&action)

      if cacheable
        @lock.with_write_lock do
          @cache[name] = result
        end
      end

      result
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
        result = yield @index
        @cache.clear
        result
      end
    end

  end
end
