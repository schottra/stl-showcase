'use strict';
window.config = {};
window.config.rotationsPerSecond = .1;
window.config.enableRotation = false;

document.addEventListener('DOMContentLoaded', function() {
    var renderContainer = document.getElementById('render-container');
    var notesEl = document.getElementById('notes')
    var renderSurface = null;
    var viewer = null;
    var currentUrl = null

    var killEvent = function(e){
        e.stopPropagation();
        e.preventDefault();
    };

    function openFile(url){
        currentUrl = url;
        viewer.loadSTL(url);
    }

    var handleFileDrop = function(e){
        killEvent(e);
        var fileList = e.dataTransfer.files;
        if( !fileList.length ) {
            return;
        }

        var fileUrl = window.URL.createObjectURL(fileList[0]);
        openFile(fileUrl);
    };

    var initViewer = function(){
        window.thingiurlbase = 'scripts/vendor';
        while(renderContainer.hasChildNodes()){renderContainer.removeChild(renderContainer.lastChild);}
        viewer = new Thingiview('render-container');
        viewer.setObjectColor('#CAA618');
        viewer.setObjectMaterial('solid');
        viewer.setBackgroundColor('#000000');
        viewer.initScene();
        viewer.setRotation(true);
        viewer.setCameraView('diagonal');
        renderSurface = renderContainer.querySelector('canvas');
        //window.requestAnimationFrame(renderLoop);
        window.viewer = viewer;
    };

    function adjustCanvas(){
        initViewer();
        openFile(currentUrl);
    }

    var lastTimestamp = null;

    function renderLoop(timestamp){
        if(lastTimestamp != null){
            var deltaSeconds = (timestamp - lastTimestamp) / 1000;
        }
        lastTimestamp = timestamp;
        window.requestAnimationFrame(renderLoop);
    }


    renderContainer.addEventListener('dragover', killEvent, false);
    renderContainer.addEventListener('dragleave', killEvent, false);
    renderContainer.addEventListener('drop', handleFileDrop, false);

    window.addEventListener('resize', adjustCanvas, false);
    initViewer();


    notesEl.addEventListener('keypress', function(e){
        if(e.keyCode == 13){
            notesEl.blur()
            return false;
        }

        return true;
    }, false);

}, false);
