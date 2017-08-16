module ApplicationHelper
  # rouge requires
  require 'rouge/plugins/redcarpet'

  class HTMLWithRouge < Redcarpet::Render::HTML
    include Rouge::Plugins::Redcarpet

    # Override this method for custom formatting behavior
    def rouge_formatter(lexer)
      formatter = Rouge::Formatters::HTML.new
      formatter2 = Rouge::Formatters::HTMLTable.new(formatter,
                                                    opts={code_class: 'code',
                                                          table_class: 'codehilite',
                                                          gutter_class: 'codegutter'})
    end

    # Custom header renderer to render linked headers
    def header(text, level)
      s = "<span class=\"header-link-icon\"></span>"
      h_class = "class=\"header-link\""
      p = text.parameterize
      a = "<a #{h_class} id=\"#{p}\" href=\"\##{p}\">#{s}#{text}</a>"
        "<h#{level}>#{a}</h#{level}>"
    end
  end

  def markdown(content)
    renderer = HTMLWithRouge.new(link_attributes: { target: '_blank' })
    options = {
      autolink: true,
      no_intra_emphasis: true,
      disable_indented_code_blocks: true,
      fenced_code_blocks: true,
      lax_html_blocks: true,
      strikethrough: true,
      superscript: true,
      prettify: true,
      highlight: true,
      footnotes: true,
      quote: true
    }
    Redcarpet::Markdown.new(renderer, options).render(content).html_safe
  end

  # Returns the full title on a per-page basis.
  def full_title(page_title = '')
    base_title = "Sergio Puleri"
    if page_title.empty?
      base_title
    else
      page_title + " — " + base_title
    end
  end
end
