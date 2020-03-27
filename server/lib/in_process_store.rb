# frozen_string_literal: true

module Lib
  class InProcessStore

    def initialize
      @index = {}
      @lock = Concurrent::ReadWriteLock.new

      @queries = {}
      @cache = {}
      @cacheable = {}
    end

    def read
      @lock.with_read_lock do
        yield @index
      end
    end

    def write
      @lock.with_write_lock do
        result = yield @index
        @cache.clear
        result
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
      end
    end

    def clear
      write do
        @index.clear
        @cache.clear
      end
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

  end
end
