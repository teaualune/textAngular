/*
textAngular
Author : Austin Anderson
License : 2013 MIT
Version 1.2.2

See README.md or https://github.com/fraywing/textAngular/wiki for requirements and use.
*/
angular.module('textAngularSetup', [])
	
// Here we set up the global display defaults, to set your own use a angular $provider#decorator.
.value('taOptions',  {
	toolbar: [
		['redo', 'undo'],
		['h1', 'p', 'bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'insertLink']
	],
	classes: {
		focussed: "ta-focussed",
		toolbar: "ta-toolbar",
		toolbarGroup: "ta-button-group",
		toolbarButton: "ta-toolbar-button",
		toolbarButtonActive: "ta-toolbar-button-active",
		disabled: "ta-toolbar-button-disabled",
		textEditor: 'form-control',
		htmlEditor: 'form-control'
	},
	setup: {
		// wysiwyg mode
		textEditorSetup: angular.noop,
		// raw html
		htmlEditorSetup: angular.noop
	}
})

.constant('taTranslations', {
	// moved to sub-elements
	//toggleHTML: "Toggle HTML",
	//insertImage: "Please enter a image URL to insert",
	insertLink: "URL...",
	//insertVideo: "Please enter a youtube URL to embed",
	h1: {
		tooltip: 'Heading'
	},
	p: {
		tooltip: 'Paragraph'
	},
	undo: {
		tooltip: 'Undo'
	},
	redo: {
		tooltip: 'Redo'
	},
	ul: {
		tooltip: 'Unordered List'
	},
	ol: {
		tooltip: 'Ordered List'
	},
	bold: {
		tooltip: 'Bold'
	},
	italic: {
		tooltip: 'Italic'
	},
	underline: {
		tooltip: 'Underline'
	},
	strikeThrough:{
		tooltip: 'Strikethrough'
	}
})
.run(['taRegisterTool', '$window', 'taTranslations', function(taRegisterTool, $window, taTranslations){
	taRegisterTool('h1', {
		iconclass: 'fa fa-header',
		tooltiptext: taTranslations.h1.tooltip,
		action: function(){
			return this.$editor().wrapSelection("formatBlock", "<H1>");
		},
		activeState: function(){
			return function(){ return this.$editor().queryFormatBlockState('h1'); };
		}
	});
	taRegisterTool('p', {
		iconclass: 'fa fa-paragraph',
		tooltiptext: taTranslations.p.tooltip,
		action: function(){
			return this.$editor().wrapSelection("formatBlock", "<P>");
		},
		activeState: function(){ return this.$editor().queryFormatBlockState('p'); }
	});
	taRegisterTool('ul', {
		iconclass: 'fa fa-list-ul',
		tooltiptext: taTranslations.ul.tooltip,
		action: function(){
			return this.$editor().wrapSelection("insertUnorderedList", null);
		},
		activeState: function(){ return this.$editor().queryCommandState('insertUnorderedList'); }
	});
	taRegisterTool('ol', {
		iconclass: 'fa fa-list-ol',
		tooltiptext: taTranslations.ol.tooltip,
		action: function(){
			return this.$editor().wrapSelection("insertOrderedList", null);
		},
		activeState: function(){ return this.$editor().queryCommandState('insertOrderedList'); }
	});
	taRegisterTool('undo', {
		iconclass: 'fa fa-undo',
		tooltiptext: taTranslations.undo.tooltip,
		action: function(){
			return this.$editor().wrapSelection("undo", null);
		}
	});
	taRegisterTool('redo', {
		iconclass: 'fa fa-repeat',
		tooltiptext: taTranslations.redo.tooltip,
		action: function(){
			return this.$editor().wrapSelection("redo", null);
		}
	});
	taRegisterTool('bold', {
		iconclass: 'fa fa-bold',
		tooltiptext: taTranslations.bold.tooltip,
		action: function(){
			return this.$editor().wrapSelection("bold", null);
		},
		activeState: function(){
			return this.$editor().queryCommandState('bold');
		},
		commandKeyCode: 98
	});
	taRegisterTool('italics', {
		iconclass: 'fa fa-italic',
		tooltiptext: taTranslations.italic.tooltip,
		action: function(){
			return this.$editor().wrapSelection("italic", null);
		},
		activeState: function(){
			return this.$editor().queryCommandState('italic');
		},
		commandKeyCode: 105
	});
	taRegisterTool('underline', {
		iconclass: 'fa fa-underline',
		tooltiptext: taTranslations.underline.tooltip,
		action: function(){
			return this.$editor().wrapSelection("underline", null);
		},
		activeState: function(){
			return this.$editor().queryCommandState('underline');
		},
		commandKeyCode: 117
	});
	taRegisterTool('strikeThrough', {
		iconclass: 'fa fa-strikethrough',
		action: function(){
			return this.$editor().wrapSelection("strikeThrough", null);
		},
		activeState: function(){
			return document.queryCommandState('strikeThrough');
		}
	});
	taRegisterTool('insertLink', {
		tooltiptext: taTranslations.insertLink.tooltip,
		iconclass: 'fa fa-link',
		action: function(){
			var urlLink;
			urlLink = $window.prompt(taTranslations.insertLink.dialogPrompt, 'http://');
			if(urlLink && urlLink !== '' && urlLink !== 'http://'){
				return this.$editor().wrapSelection('createLink', urlLink, true);
			}
		},
		activeState: function(commonElement){
			if(commonElement) return commonElement[0].tagName === 'A';
			return false;
		},
		onElementSelect: {
			element: 'a',
			action: function(event, $element, editorScope){
				// setup the editor toolbar
				// Credit to the work at http://hackerwins.github.io/summernote/ for this editbar logic
				event.preventDefault();
				editorScope.displayElements.popover.css('width', '435px');
				var container = editorScope.displayElements.popoverContainer;
				container.empty();
				container.css('line-height', '28px');
				var link = angular.element('<a href="' + $element.attr('href') + '" target="_blank">' + $element.attr('href') + '</a>');
				link.css({
					'display': 'inline-block',
					'max-width': '200px',
					'overflow': 'hidden',
					'text-overflow': 'ellipsis',
					'white-space': 'nowrap',
					'vertical-align': 'middle'
				});
				container.append(link);
				var buttonGroup = angular.element('<div class="pull-right">');
				var reLinkButton = angular.element('<button class="ta-toolbar-button" tabindex="-1" unselectable="on"><i class="fa fa-edit icon-edit"></i></button>');
				reLinkButton.on('click', function(event){
					event.preventDefault();
					var urlLink = $window.prompt(taTranslations.insertLink.dialogPrompt, $element.attr('href'));
					if(urlLink && urlLink !== '' && urlLink !== 'http://'){
						$element.attr('href', urlLink);
						editorScope.updateTaBindtaTextElement();
					}
					editorScope.hidePopover();
				});
				buttonGroup.append(reLinkButton);
				var unLinkButton = angular.element('<button class="ta-toolbar-button" tabindex="-1" unselectable="on"><i class="fa fa-unlink icon-unlink"></i></button>');
				// directly before this click event is fired a digest is fired off whereby the reference to $element is orphaned off
				unLinkButton.on('click', function(event){
					event.preventDefault();
					$element.replaceWith($element.contents());
					editorScope.updateTaBindtaTextElement();
					editorScope.hidePopover();
				});
				buttonGroup.append(unLinkButton);
				// var targetToggle = angular.element('<button class="pure-button" tabindex="-1" unselectable="on">Open in New Window</button>');
				// if($element.attr('target') === '_blank'){
				// 	targetToggle.addClass('active');
				// }
				// targetToggle.on('click', function(event){
				// 	event.preventDefault();
				// 	$element.attr('target', ($element.attr('target') === '_blank') ? '' : '_blank');
				// 	targetToggle.toggleClass('active');
				// 	editorScope.updateTaBindtaTextElement();
				// });
				// buttonGroup.append(targetToggle);
				container.append(buttonGroup);
				editorScope.showPopover($element);
			}
		}
	});
}]);
