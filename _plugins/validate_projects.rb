# Fails the build when a project page has missing or invalid front matter, so
# contributors get a clear error in CI instead of a broken card on the site.
module AiRebuilds
  class ValidateProjects < Jekyll::Generator
    safe true
    priority :highest

    REQUIRED = %w[title summary status original].freeze
    PATH_RE = %r{\Aprojects/[a-z0-9]+(?:-[a-z0-9]+)*/index\.(md|html)\z}.freeze

    def generate(site)
      statuses = Array(site.config["statuses"]).map { |s| s["key"] }
      errors = []

      site.pages.select { |p| p.data["layout"] == "project" }.each do |page|
        where = page.relative_path
        data = page.data

        unless PATH_RE.match?(where)
          errors << "#{where}: project pages must live at projects/<kebab-case-slug>/index.md"
        end

        REQUIRED.each do |key|
          value = data[key]
          errors << "#{where}: missing required field `#{key}`" if value.nil? || value.to_s.strip.empty?
        end

        if data["status"] && !statuses.include?(data["status"])
          errors << "#{where}: status `#{data['status']}` must be one of: #{statuses.join(', ')}"
        end

        original = data["original"]
        if original && !original.is_a?(Hash)
          errors << "#{where}: `original` must be a mapping (developer, year, platforms, ...)"
        elsif original
          platforms = original["platforms"]
          unless platforms.is_a?(Array) && !platforms.empty?
            errors << "#{where}: `original.platforms` must be a non-empty list"
          end
        end

        %w[maintainers tags help_wanted].each do |key|
          next if data[key].nil? || data[key].is_a?(Array)

          errors << "#{where}: `#{key}` must be a list"
        end

        Array(data["maintainers"]).each do |m|
          if m.to_s.start_with?("@")
            errors << "#{where}: maintainer `#{m}` should be a GitHub username without the leading @"
          end
        end
      end

      return if errors.empty?

      raise Jekyll::Errors::FatalException,
            "Invalid project front matter:\n  - " + errors.join("\n  - ")
    end
  end
end
