module ApplicationHelper
  class HTMLWithPygments < Redcarpet::Render::HTML
    def block_code(code, language)
      Pygments.highlight(code, lexer: language)
    end
  end
  def markdown(content)
    renderer = HTMLWithPygments.new(hard_wrap: true, filter_html: true)
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
      footnotes:true,
      quote:true
		}
		Redcarpet::Markdown.new(renderer, options).render(content).html_safe
  end
end
