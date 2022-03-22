(function() {
  var dndHandler = {
    
    draggedElement: null, 
    
    placeElement: function(dropper) {
      dropper.classList.remove('over');
      if (dropper.getAttribute('data-kana') == dndHandler.draggedElement.textContent) {
        var clonedElement = dndHandler.draggedElement.cloneNode(true);
        clonedElement = dropper.appendChild(clonedElement); 
        dndHandler.applyDragEvents(clonedElement); 
        var replaceElement = document.createElement('span');
        dndHandler.draggedElement.parentNode.replaceChild(replaceElement, dndHandler.draggedElement); 
        if (document.querySelectorAll('.kanas [data-type]').length == 0) {
          document.querySelector('#timer').classList.add('finished');
        }
      } else {
        dropper.classList.add('error');
        var errors = document.querySelector('#errors');
        errors.setAttribute('data-errors', parseInt(errors.getAttribute('data-errors')) + 1);
        setTimeout(function() {
          document.querySelector('.error').classList.remove('error');
        }, 300);
      }
    },
    
    applyDragEvents: function(element) {
      element.draggable = true;
      var dndHandler = this; 
      element.addEventListener('dragstart', function(e) {
        dndHandler.draggedElement = e.target; 
        e.dataTransfer.setData('text/plain', '');
      });
      element.addEventListener('click', function(e) {
        if (previousDraggedElement = document.querySelector('.dragging')) {
          previousDraggedElement.classList.remove('dragging');
        }
        dndHandler.draggedElement = e.target; 
        e.target.classList.add('dragging');
      });
    },

    applyDropEvents: function(dropper) {
      dropper.addEventListener('dragover', function(e) {
        var target = e.target,
            draggedElement = dndHandler.draggedElement,
            dropClass = draggedElement.getAttribute('data-type'); 
        while (target != null && !target.classList.contains(dropClass)) { 
          target = target.parentNode;
          if (target.tagName == 'BODY') {
            target = null;
          }
        }
        if (target) {
          e.preventDefault(); 
          this.classList.add('over');
        }
      });
      dropper.addEventListener('dragleave', function() {
        this.classList.remove('over');
      });
      var dndHandler = this; 
      dropper.addEventListener('drop', function(e) {
        dndHandler.placeElement(e.target);
      });
      dropper.addEventListener('click', function(e) {
        if (draggedElement = document.querySelector('.dragging')) {
          if (draggedElement.getAttribute('data-type') == e.target.className) {
            dndHandler.placeElement(e.target);
            draggedElement.classList.remove('dragging');
          }
        }
      });
    }
    
  };

  var elements = document.querySelectorAll('[data-type]'),
      elementsLen = elements.length;
  for (var i = 0; i < elementsLen; i++) {
    dndHandler.applyDragEvents(elements[i]); 
  }

  var droppers = document.querySelectorAll('.katakana, .hiragana'),
      droppersLen = droppers.length;
  for (var i = 0; i < droppersLen; i++) {
    dndHandler.applyDropEvents(droppers[i]); 
  }
  
  var kanasArea = document.querySelector('.kanas');
  for (var i = kanasArea.children.length; i >= 0; i--) {
    kanasArea.appendChild(kanasArea.children[Math.random() * i | 0]);
  }
  
  var start = Date.now();
  setInterval(function() {
    var timer = document.querySelector('#timer');
    if (!timer.classList.contains('finished')) {
      var delta = Date.now() - start, 
          time = Math.floor(delta / 1000),
          minutes = ('00' + parseInt(time / 60)).substr(-2),
          seconds = ('00' + (time % 60)).substr(-2);
      timer.textContent = minutes + ' : ' + seconds;
    }
  }, 100); 

})();