function GenConfig(caller, $settingsArea) {
  var self = this;
  var gen = {};
  this.gen = gen;

  this.getTitle = function(opt) {
    let $title = $('<div class="configurationTitle"></div>');
    let $toolTip = $('<span> </span><div class="tooltip">?<div class="tooltiptext"></div></div>');
    $title.text(opt.option);

    if (opt.help) {
      $toolTip.find('.tooltiptext').text(opt.help);
      $title.append($toolTip);
    }
    if (opt.helpSide) {
      $toolTip.addClass(opt.helpSide);
    } else {
      $toolTip.addClass('right');
    }

    return $title;
  }

  gen.label = function(opt, currentOptions) {
    let $div = $('<div class="configuration"></div>');
    let $textBox = $('<div class="text"></div>');
    $textBox.text(opt.text);

    $div.append($textBox);

    return $div;
  }

  gen.buttons = function(opt, currentOptions) {
    let $div = $('<div class="configuration"></div>');
    let $buttonsBox = $('<div class="buttons"></div>');

    for (let button of opt.buttons) {
      let $button = $('<button></button>');
      $button.text(button.label);
      $button.click(function() {
        caller[button.callback](opt, currentOptions);
      });
      $buttonsBox.append($button);
    }

    $div.append($buttonsBox);

    return $div;
  }

  gen.custom = function(opt, currentOptions) {
    let $custom = caller[opt.generatorFunction](opt, currentOptions);
    if ($custom == false) {
      return;
    }

    let $div = $('<div class="configuration"></div>');
    $div.append(self.getTitle(opt));
    $div.append($custom);
    return $div;  
  }

  gen.color = function(opt, currentOptions) {
    let $div = $('<div class="configuration"></div>');
    let $colorBox = $('<div class="color"><input type="color"><input type="text"></div>');
    let $alphaBox = $('<div class="slider">Opacity: <input type="range"></div>');
    let $color = $colorBox.find('input[type=color]');
    let $text = $colorBox.find('input[type=text]');
    let $alpha = $alphaBox.find('input');
    $alpha.attr('min', 0);
    $alpha.attr('max', 255);
    $alpha.attr('step', 1);
    let currentVal = currentOptions[opt.option];

    if (typeof currentVal == 'undefined') {
      currentVal = '#FFFFFF';
    }

    function setInputs(currentVal) {
      // Strip hex
      if (currentVal[0] == '#') {
        currentVal = currentVal.slice(1);
      }

      // Convert 3/4 notation to 6/8
      if (currentVal.length < 6) {
        let tmp = '';
        for (let c of currentVal) {
          tmp = c + c;
        }
        currentVal = tmp;
      }

      // Split into color and alpha
      let currentValColor = currentVal.slice(0,6).toLowerCase();
      let currentValAlpha = currentVal.slice(6,8);
      if (currentValAlpha == '') {
        currentValAlpha = 255;
      } else {
        currentValAlpha = parseInt(currentValAlpha, 16);
      }

      $color.val('#' + currentValColor);
      $alpha.val(currentValAlpha);
      $text.val('#' + currentValColor + ('0' + currentValAlpha.toString(16)).slice(-2));
    }

    setInputs(currentVal);

    function setColor() {
      let valColor = $color.val();
      let valAlpha = $alpha.val();
      valAlpha = ('0' + parseInt(valAlpha).toString(16)).slice(-2);

      let val = valColor + valAlpha;
      caller.saveHistory();
      currentOptions[opt.option] = val;
      $text.val(val);
      if (opt.reset) {
        caller.resetScene(false);
      }
    }

    $color.change(setColor);
    $alpha.change(setColor);
    $text.change(function(){
      let val = $text.val();
      setInputs(val);
      caller.saveHistory();
      currentOptions[opt.option] = val;
      if (opt.reset) {
        caller.resetScene(false);
      }
    });

    $div.append(self.getTitle(opt));
    $div.append($colorBox);
    $div.append($alphaBox);

    return $div;
  }

  gen.selectImage = function(opt, currentOptions) {
    function selectImageDialog() {
      let $body = $('<div class="selectImage"></div>');
      let $filter = $(
        '<div class="filter">Filter by Type: ' +
          '<select>' +
            '<option selected value="any">Any</option>' +
            '<option value="box">Box</option>' +
            '<option value="cylinder">Cylinder</option>' +
            '<option value="sphere">Sphere</option>' +
            '<option value="ground">Ground</option>' +
            '<option value="robot">Robot</option>' +
          '</select>' +
        '</div>'
      );
      let $select = $filter.find('select');
      let $search = $(
        '<div class="search">Search: ' +
          '<input type="text"></input>' +
        '</div>'
      );
      let $searchInput = $search.find('input');

      let $itemList = $('<div class="images"></div>');

      BUILT_IN_IMAGES.forEach(function(image){
        let basename = image.url.split('/').pop();

        let $row = $('<div class="row"></div>');
        $row.addClass(image.type);

        let $preview = $('<div class="preview"><img src="' + image.url + '" alt="' + basename + '"></div>');

        let $descriptionBox = $('<div class="description"></div>');
        let $basename = $('<p class="bold"></p>').text(basename + ' (' + image.type + ')');
        let $description = $('<p></p>').text(image.description);
        $descriptionBox.append($basename);
        $descriptionBox.append($description);

        let $selectBox = $('<div class="select"><button>Select</button></div>');
        let $selectBtn = $selectBox.find('button');
        $selectBtn.prop('url', image.url);

        $selectBtn.click(function(e){
          caller.saveHistory();
          currentOptions[opt.option] = e.target.url;
          if (opt.reset) {
            caller.resetScene(false);
          }

          // Save search
          caller.selectImage_filterType = $select.val();
          caller.selectImage_searchText = $searchInput.val();
          caller.selectImage_scroll = $itemList[0].scrollTop;

          $dialog.close();
        });

        $row.append($preview);
        $row.append($descriptionBox);
        $row.append($selectBox);
        $itemList.append($row);
      });

      $body.append($filter);
      $body.append($search);
      $body.append($itemList);

      function filterList(){
        let filter = $select.val();
        let search = $searchInput.val().trim().toLowerCase();

        let count = 0;
        $itemList[0].childNodes.forEach(function(item){
          let descEl = item.querySelector('.description');
          let itemText = descEl ? descEl.textContent.toLowerCase() : '';
          if (
            (filter == 'any' || item.classList.contains(filter.replace(/\W/g, '')))
            && (search == '' || itemText.indexOf(search) != -1)
          ) {
            item.classList.remove('hide');
            count++;
          } else {
            item.classList.add('hide');
          }
        });

        updateSearchCount(count);
      }

      $select.change(filterList);
      $searchInput.on('input', filterList);

      let $buttons = $(
        '<div class="searchCount"></div><button type="button" class="cancel btn-light">Cancel</button>'
      );

      function updateSearchCount(count) {
        $buttons.siblings('.searchCount').text(count + ' image textures found');
      }

      updateSearchCount($itemList[0].childNodes.length);

      function setScroll() {
        if (caller.selectImage_scroll != 0) {
          $itemList[0].scrollTop = caller.selectImage_scroll;
          if ($itemList[0].scrollTop == 0) {
            setTimeout(setScroll, 200);
          }  
        }
      }

      if (caller.selectImage_filterType) {
        $select.val(caller.selectImage_filterType);
        $searchInput.val(caller.selectImage_searchText);
        filterList();
        setScroll();
      }
      let $dialog = dialog('Select Built-In Image', $body, $buttons);

      $buttons.click(function() {
        // Save search
        caller.selectImage_filterType = $select.val();
        caller.selectImage_searchText = $searchInput.val();
        caller.selectImage_scroll = $itemList[0].scrollTop;
        
        $dialog.close();
      });
    }

    let $div = $('<div class="configuration"></div>');
    let $buttonsBox = $('<div class="buttons"></div>');

    let $button = $('<button>Select built-in image</button>');
    $button.click(selectImageDialog);
    $buttonsBox.append($button);
    $div.append($buttonsBox);

    return $div;
  };

  gen.selectModel = function(opt, currentOptions) {
    function selectModelDialog() {
      let $body = $('<div class="selectModel"></div>');
      let $filter = $(
        '<div class="filter">Filter by Type: ' +
          '<select>' +
            '<option selected value="any">Any</option>' +
          '</select>' +
        '</div>'
      );
      let $select = $filter.find('select');
      for (category of BUILT_IN_MODELS_CATEGORIES) {
        $select.append('<option>' + category + '</option');
      }
      let $search = $(
        '<div class="search">Search: ' +
          '<input type="text"></input>' +
        '</div>'
      );
      let $searchInput = $search.find('input');
  
      let $itemList = $('<div class="items"></div>');
  
      BUILT_IN_MODELS.forEach(function(model){
        let basename = model.url.split('/').pop();
  
        let $row = $('<div class="row"></div>');
        let category = model.category.replace(/\W/g, '');
        $row.addClass(category);
  
        let $descriptionBox = $('<div class="description"></div>');
        let $basename = $('<p class="bold"></p>').text(basename);
        $descriptionBox.append($basename);
  
        let $selectBox = $('<div class="select"><button>Select</button></div>');
        let $selectBtn = $selectBox.find('button');
        $selectBtn.prop('url', model.url);
  
        $selectBtn.click(function(e){
          caller.saveHistory();
          currentOptions[opt.option] = e.target.url;
          if (opt.reset) {
            caller.resetScene(false);
          }
  
          // Save search
          caller.selectModel_filterType = $select.val();
          caller.selectModel_searchText = $searchInput.val();
          caller.selectModel_scroll = $itemList[0].scrollTop;
  
          $dialog.close();
        });
  
        $row.append($descriptionBox);
        $row.append($selectBox);
        $itemList.append($row);
      });
  
      $body.append($filter);
      $body.append($search);
      $body.append($itemList);
  
      function filterList(){
        let filter = $select.val();
        let search = $searchInput.val().trim().toLowerCase();
  
        let count = 0;
        $itemList[0].childNodes.forEach(function(item){
          let itemText = item.childNodes[0].textContent.toLowerCase();
          if (
            (filter == 'any' || item.classList.contains(filter.replace(/\W/g, '')))
            && (search == '' || itemText.indexOf(search) != -1)
          ) {
            item.classList.remove('hide');
            count++;
          } else {
            item.classList.add('hide');
          }
        });
  
        updateSearchCount(count);
      }
  
      $select.change(filterList);
      $searchInput.on('input', filterList);
  
      let $buttons = $(
        '<div class="searchCount"></div><button type="button" class="cancel btn-light">Cancel</button>'
      );
  
      function updateSearchCount(count) {
        $buttons.siblings('.searchCount').text(count + ' models found');
      }
  
      updateSearchCount($itemList[0].childNodes.length);
  
      function setScroll() {
        if (caller.selectModel_scroll != 0) {
          $itemList[0].scrollTop = caller.selectModel_scroll;
          if ($itemList[0].scrollTop == 0) {
            setTimeout(setScroll, 200);
          }  
        }
      }
  
      if (caller.selectModel_filterType) {
        $select.val(caller.selectModel_filterType);
        $searchInput.val(caller.selectModel_searchText);
        filterList();
        setScroll();
      }
  
      let $dialog = dialog('Select Built-In Model', $body, $buttons);
  
      $buttons.click(function() {
        // Save search
        caller.selectModel_filterType = $select.val();
        caller.selectModel_searchText = $searchInput.val();
        caller.selectModel_scroll = $itemList[0].scrollTop;
        
        $dialog.close();
      });
    }

    let $div = $('<div class="configuration"></div>');
    let $buttonsBox = $('<div class="buttons"></div>');

    let $button = $('<button>Select built-in model</button>');
    $button.click(selectModelDialog);
    $buttonsBox.append($button);
    $div.append($buttonsBox);

    return $div;
  };

  gen.sliderBox = function(opt, currentValue, callback) {
    let $sliderBox = $(
      '<div class="slider">' +
        '<input type="range">' +
        '<input type="text">' +
      '</div>'
    );
    let $slider = $sliderBox.find('input[type=range]');
    let $input = $sliderBox.find('input[type=text]');

    $slider.attr('min', opt.min);
    $slider.attr('max', opt.max);
    $slider.attr('step', opt.step);
    $slider.attr('value', currentValue);
    $input.val(currentValue);

    $slider.on('input', function(){
      $input.val($slider.val());
    });
    $slider.on('change', function(){
      caller.saveHistory();
      callback(parseFloat($slider.val()));
      if (opt.reset) {
        caller.resetScene(false);
      }
    })
    $input.change(function(){
      caller.saveHistory();
      callback(parseFloat($input.val()));
      $slider.val($input.val());
      if (opt.reset) {
        caller.resetScene(false);
      }
    });

    return $sliderBox;
  }

  gen.vectors = function(opt, currentOptions) {
    let $div = $('<div class="configuration"></div>');

    $div.append(self.getTitle(opt));

    if (currentOptions[opt.option] == null) {
      currentOptions[opt.option] = [0,0,0];
    }

    currentOptions[opt.option].forEach(function(currentOption, i){
      let slider = null;

      if (typeof opt.deg2rad != 'undefined' && opt.deg2rad) {
        slider = gen.sliderBox(opt, currentOption / Math.PI * 180, function(val) {
          currentOptions[opt.option][i] = val / 180 * Math.PI;
        });
      } else {
        slider = gen.sliderBox(opt, currentOption, function(val) {
          currentOptions[opt.option][i] = val;
        });
      }
      $div.append(slider);
    })

    return $div;
  }

  gen.slider = function(opt, currentOptions) {
    let $div = $('<div class="configuration"></div>');

    $div.append(self.getTitle(opt));
    $div.append(gen.sliderBox(opt, currentOptions[opt.option], function(val) {
      currentOptions[opt.option] = val;
    }));

    return $div;
  }

  gen.floatText = function(opt, currentOptions) {
    let $div = $('<div class="configuration"></div>');
    let $textBox = $('<div class="text"><input type="text"></div>');
    let $input = $textBox.find('input');
    let currentVal = currentOptions[opt.option];

    $input.val(currentVal);

    $input.change(function(){
      let val = parseFloat($input.val())
      if (isNaN(val)) {
        toastMsg('Not a valid number');
      } else {
        caller.saveHistory();
        currentOptions[opt.option] = val;
        if (opt.reset) {
          caller.resetScene(false);
        }
      }
    });

    $div.append(self.getTitle(opt));
    $div.append($textBox);

    return $div;
  }

  gen.intText = function(opt, currentOptions) {
    let $div = $('<div class="configuration"></div>');
    let $textBox = $('<div class="text"><input type="text"></div>');
    let $input = $textBox.find('input');
    let currentVal = currentOptions[opt.option];

    $input.val(currentVal);

    $input.change(function(){
      let val = parseInt($input.val())
      if (isNaN(val)) {
        toastMsg('Not a valid number');
      } else {
        caller.saveHistory();
        currentOptions[opt.option] = val;
        if (opt.reset) {
          caller.resetScene(false);
        }
      }
    });

    $div.append(self.getTitle(opt));
    $div.append($textBox);

    return $div;
  }

  gen.strText = function(opt, currentOptions) {
    let $div = $('<div class="configuration"></div>');
    let $textBox = $('<div class="text"><input type="text"></div>');
    let $input = $textBox.find('input');
    let currentVal = currentOptions[opt.option];

    $input.val(currentVal);

    $input.change(function(){
      caller.saveHistory();
      currentOptions[opt.option] = $input.val();
      if (opt.reset) {
        caller.resetScene(false);
      }
    });

    $div.append(self.getTitle(opt));
    $div.append($textBox);

    return $div;
  }

  gen.boolean = function(opt, currentOptions) {
    let $div = $('<div class="configuration"></div>');
    let $checkBox = $('<div class="text"><input type="checkbox"></div>');
    let $input = $checkBox.find('input');
    let currentVal = currentOptions[opt.option];

    $input.prop('checked', currentVal);

    $input.change(function(){
      caller.saveHistory();
      var isChecked = $input.prop('checked');
      currentOptions[opt.option] = isChecked;
      // Apply linked option changes if specified
      if (isChecked && opt.onTrue) {
        for (var key in opt.onTrue) {
          currentOptions[key] = opt.onTrue[key];
        }
      } else if (!isChecked && opt.onFalse) {
        for (var key in opt.onFalse) {
          currentOptions[key] = opt.onFalse[key];
        }
      }
      if (opt.reset) {
        caller.resetScene(false);
      }
    });

    $div.append(self.getTitle(opt));
    $div.append($checkBox);

    return $div;
  }

  gen.select = function(opt, currentOptions) {
    let $div = $('<div class="configuration"></div>');
    let $select = $('<select></select>');
    let currentVal = currentOptions[opt.option];

    opt.options.forEach(function(option){
      let $opt = $('<option></option>');
      $opt.prop('value', option[1]);
      $opt.text(option[0]);
      if (option[1] == currentVal) {
        $opt.attr('selected', true);
      }

      $select.append($opt);
    });

    $select.change(function(){
      caller.saveHistory();
      currentOptions[opt.option] = $select.val();
      if (opt.reset) {
        caller.resetScene(false);
      }
    });

    $div.append(self.getTitle(opt));
    $div.append($select);

    return $div;
  }

  this.displayOptionsConfigurations = function(template, currentOptions) {
    // Group options by section
    var sections = {};
    var sectionOrder = [];
    var sectionMeta = {};

    template.optionsConfigurations.forEach(function(optionConfiguration) {
      var sectionName = optionConfiguration.section || 'General';

      if (!sections[sectionName]) {
        sections[sectionName] = [];
        sectionOrder.push(sectionName);
        sectionMeta[sectionName] = {
          icon: optionConfiguration.sectionIcon || '',
          open: optionConfiguration.sectionOpen !== undefined ? optionConfiguration.sectionOpen : false
        };
      }
      sections[sectionName].push(optionConfiguration);
    });

    // Check visibility condition
    function checkShowWhen(showWhen, currentOptions) {
      if (!showWhen) return true;

      var optionValue = currentOptions[showWhen.option];

      if (showWhen.value !== undefined) {
        return optionValue === showWhen.value;
      }
      if (showWhen.notValue !== undefined) {
        return optionValue !== showWhen.notValue;
      }
      return true;
    }

    // Count visible options in a section
    function countVisibleOptions(sectionOptions, currentOptions) {
      var count = 0;
      sectionOptions.forEach(function(opt) {
        if (checkShowWhen(opt.showWhen, currentOptions)) {
          count++;
        }
      });
      return count;
    }

    // Check if we should use simple layout (single "General" section only)
    var useSimpleLayout = (sectionOrder.length === 1 && sectionOrder[0] === 'General');

    // Render each section
    sectionOrder.forEach(function(sectionName) {
      var sectionOptions = sections[sectionName];
      var meta = sectionMeta[sectionName];

      // Check if any options in this section should be visible
      // Also check if the entire section has a showWhen condition
      var sectionHasVisibleOptions = countVisibleOptions(sectionOptions, currentOptions) > 0;

      // Check if the first option's showWhen should hide the entire section
      var firstOpt = sectionOptions[0];
      var sectionVisible = true;
      if (firstOpt.showWhen && firstOpt.sectionIcon) {
        // If first option has both showWhen and sectionIcon, it controls section visibility
        sectionVisible = checkShowWhen(firstOpt.showWhen, currentOptions);
      }

      if (!sectionVisible || !sectionHasVisibleOptions) {
        return; // Skip this section entirely
      }

      // For simple layout, render options directly without section wrapper
      if (useSimpleLayout) {
        sectionOptions.forEach(function(optionConfiguration) {
          if (typeof gen[optionConfiguration.type] != 'undefined') {
            var isVisible = checkShowWhen(optionConfiguration.showWhen, currentOptions);
            var $optionDiv = gen[optionConfiguration.type](optionConfiguration, currentOptions);
            if ($optionDiv) {
              if (!isVisible) {
                $optionDiv.hide();
              }
              if (optionConfiguration.showWhen) {
                $optionDiv.attr('data-show-when-option', optionConfiguration.showWhen.option);
                if (optionConfiguration.showWhen.value !== undefined) {
                  $optionDiv.attr('data-show-when-value', optionConfiguration.showWhen.value);
                }
                if (optionConfiguration.showWhen.notValue !== undefined) {
                  $optionDiv.attr('data-show-when-not-value', optionConfiguration.showWhen.notValue);
                }
              }
              $settingsArea.append($optionDiv);
            }
          } else {
            console.log('Unrecognized configuration type:', optionConfiguration.type);
          }
        });
        return;
      }

      // Create section wrapper
      var $section = $('<div class="config-section"></div>');
      $section.attr('data-section', sectionName);

      // Create section header
      var iconHtml = meta.icon ? '<span class="section-icon">' + meta.icon + '</span> ' : '';
      var $header = $('<div class="config-section-header"></div>');
      $header.html(iconHtml + '<span class="section-title">' + sectionName + '</span><span class="section-toggle">▼</span>');

      // Create section content
      var $content = $('<div class="config-section-content"></div>');

      // Set initial state
      if (meta.open) {
        $section.addClass('open');
      } else {
        $content.hide();
        $header.find('.section-toggle').text('▶');
      }

      // Toggle on header click
      $header.click(function() {
        var $toggle = $(this).find('.section-toggle');
        var $sectionContent = $(this).next('.config-section-content');

        if ($section.hasClass('open')) {
          $section.removeClass('open');
          $sectionContent.hide();
          $toggle.text('▶');
        } else {
          $section.addClass('open');
          $sectionContent.show();
          $toggle.text('▼');
        }
      });

      $section.append($header);

      // Render options in this section
      var hasVisibleContent = false;
      sectionOptions.forEach(function(optionConfiguration) {
        if (typeof gen[optionConfiguration.type] != 'undefined') {
          // Check showWhen condition
          var isVisible = checkShowWhen(optionConfiguration.showWhen, currentOptions);

          var $optionDiv = gen[optionConfiguration.type](optionConfiguration, currentOptions);
          if ($optionDiv) {
            if (!isVisible) {
              $optionDiv.hide();
            } else {
              hasVisibleContent = true;
            }

            // Store showWhen info for dynamic updates
            if (optionConfiguration.showWhen) {
              $optionDiv.attr('data-show-when-option', optionConfiguration.showWhen.option);
              if (optionConfiguration.showWhen.value !== undefined) {
                $optionDiv.attr('data-show-when-value', optionConfiguration.showWhen.value);
              }
              if (optionConfiguration.showWhen.notValue !== undefined) {
                $optionDiv.attr('data-show-when-not-value', optionConfiguration.showWhen.notValue);
              }
            }

            $content.append($optionDiv);
          }
        } else {
          console.log('Unrecognized configuration type:', optionConfiguration.type);
        }
      });

      $section.append($content);

      // Only add section if it has visible content
      if (hasVisibleContent || meta.open) {
        $settingsArea.append($section);
      }
    });

    // Add dynamic visibility update handler
    $settingsArea.on('change', 'input, select', function() {
      // Small delay to let the value update
      setTimeout(function() {
        self.updateConditionalVisibility(currentOptions);
      }, 50);
    });
  };

  // Update visibility of conditional options
  this.updateConditionalVisibility = function(currentOptions) {
    $settingsArea.find('[data-show-when-option]').each(function() {
      var $el = $(this);
      var optionName = $el.attr('data-show-when-option');
      var requiredValue = $el.attr('data-show-when-value');
      var notValue = $el.attr('data-show-when-not-value');
      var currentValue = currentOptions[optionName];

      var shouldShow = true;
      if (requiredValue !== undefined) {
        // Handle boolean comparison
        if (requiredValue === 'true') {
          shouldShow = currentValue === true;
        } else if (requiredValue === 'false') {
          shouldShow = currentValue === false;
        } else {
          shouldShow = String(currentValue) === String(requiredValue);
        }
      } else if (notValue !== undefined) {
        shouldShow = String(currentValue) !== String(notValue);
      }

      if (shouldShow) {
        $el.show();
      } else {
        $el.hide();
      }
    });

    // Update section visibility
    $settingsArea.find('.config-section').each(function() {
      var $section = $(this);
      var $content = $section.find('.config-section-content');
      var hasVisibleChildren = $content.children(':visible').length > 0 ||
                               $content.children().filter(function() { return $(this).css('display') !== 'none'; }).length > 0;

      // If section has no visible children, hide the whole section
      // But only for sections that aren't "open by default"
      if (!hasVisibleChildren && !$section.hasClass('open')) {
        $section.hide();
      } else {
        $section.show();
      }
    });
  };
}