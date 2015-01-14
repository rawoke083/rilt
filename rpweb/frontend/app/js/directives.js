app.directive('markdown', function() {
	var converter = new Showdown.converter();
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			function renderMarkdown() {
				var htmlText = converter.makeHtml(scope.$eval(attrs.markdown) || '');
				element.html(htmlText);
			}
			scope.$watch(attrs.markdown, renderMarkdown);
			renderMarkdown();
		}
	};
});

