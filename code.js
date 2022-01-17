'use strict';
var demoNamespace = {
    steps: [
        {url: '1.png', hotSpot: {pos: [2, 120], size: [261, 41]}, 
                tooltip: {pos: [149, 139], orientation: 'right', text: 'Click to see the Cost Explorer panel'}},
        {url: 'cost-explorer2.png', hotSpot: {pos: [484, 174], size: [72, 32]}, 
            tooltip: {pos: [548, 190], orientation: 'right', text: 'Show each separate service in its color'}},
        {url: 'cost-explorer2-by-service.png', hotSpot: {pos: [763, 250], size: [35, 253]}, 
            tooltip: {pos: [781, 391], orientation: 'right', text: 'Click the bar to see the details on this expense'}},
        {url: 'cost-explorer2-by-service-support.png', hotSpot: {pos: [601, 123], size: [78, 37]}, 
            tooltip: {pos: [672, 139], orientation: 'right', text: 'Let\'s change the granularity to the "Monthly"'}},
        {url: 'cost-explorer2-by-service-select.png', hotSpot: {pos: [596, 217], size: [131, 29]}},
        {url: 'cost-explorer2-by-service-monthly.png', hotSpot: {pos: [862, 128], size: [96, 31]}, 
            tooltip: {pos: [860, 140], orientation: 'left', text: 'Let\'s show the line graph instead of stack chart'}},
        {url: 'cost-explorer-stack.png', hotSpot: {pos: [862, 213], size: [119, 28]}},
        {url: 'cost-explorer-stack-line.png', hotSpot: {pos: [16, 152], size: [134, 39]}},
        {url: 'reports.png', hotSpot: {pos: [16, 577], size: [144, 39]}},
        {url: 'reservations.png'}
    ],
    currentStep: -1,
    originalSize: [1230, 740],
    overlayIsShown: true
};

demoNamespace.init = ()=>{
    // Calculate the size of demo container
    let demoContainer = document.getElementById('demoContainer');
    const demoImage = document.getElementById('demo-image');
    const demoWidth = demoImage.clientWidth;
    const containerWidth = demoContainer.clientWidth;
    if (containerWidth > demoWidth){
        demoContainer.style.width = demoWidth + 'px';
    }

    const progressBar = document.getElementById('progressBar');
    const stepsLen = demoNamespace.steps.length;
    const width = 100/stepsLen;
    for (var i = 0; i < stepsLen; i++){
        let barStep = document.createElement('div');
        barStep.id = 'step' + i;
        barStep.className = 'step';
        barStep.style.width = width + '%';
        barStep.setAttribute('title', 'Step ' + (i + 1));
        barStep.addEventListener('click', function(index) { 
            return function () {
                demoNamespace.goToStep(0, index);
            };
        }(i), true);
        progressBar.appendChild(barStep);
    }
}

demoNamespace.start = ()=>{
    document.getElementById('start').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    demoNamespace.goToStep(1);
    demoNamespace.overlayIsShown = false;
};
demoNamespace.goToStep = (diff, stepNumber)=>{
    if (demoNamespace.overlayIsShown){
        document.getElementById('start').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }
    if (stepNumber == null && ( (diff == 1 && demoNamespace.currentStep == demoNamespace.steps.length - 1) || 
    (diff == -1 && demoNamespace.currentStep <= 0))){
        demoNamespace.hideHotSpot();
        return;
    }
    if (stepNumber != null && (stepNumber < 0 || stepNumber >= demoNamespace.steps.length)){
        demoNamespace.hideHotSpot();
        return;
    }
    demoNamespace.currentStep = stepNumber != null ? stepNumber : demoNamespace.currentStep + diff;
    demoNamespace.changeScreen();
    if (demoNamespace.steps[demoNamespace.currentStep].hotSpot){
        demoNamespace.createHotSpot();
    } else {
        demoNamespace.hideHotSpot();
    }
    if (demoNamespace.steps[demoNamespace.currentStep].tooltip){
        demoNamespace.createTooltip();
    } else {
        demoNamespace.hideTooltip();
    }
    demoNamespace.setCurrentStepProgress();

}
demoNamespace.setCurrentStepProgress = ()=>{
    let prevStep = document.getElementsByClassName('current-step');
    if (prevStep.length > 0){
        for (var step of prevStep){
            step.classList.remove('current-step');
        }
    }
    const currentProgressStep = document.getElementById('step' + demoNamespace.currentStep);
    currentProgressStep.classList.add('current-step');
}
demoNamespace.recalculateSizePosition = (pos, size)=>{
    let demoImage = document.getElementById('demo-image');
    const actualWidth = demoImage.clientWidth;
    const actualHeight = demoImage.clientHeight;
    const x = actualWidth * pos[0] / demoNamespace.originalSize[0];
    const y = actualHeight * pos[1] / demoNamespace.originalSize[1];
    if (size){
        const w = actualWidth * size[0] / demoNamespace.originalSize[0];
        const h = actualHeight * size[1] / demoNamespace.originalSize[1];
        return {pos: [x, y], size: [w, h]};
    }
    return {pos: [x, y]};
}
demoNamespace.createHotSpot = ()=>{
    let curStep = demoNamespace.steps[demoNamespace.currentStep];
    const actualDimensions = demoNamespace.recalculateSizePosition(curStep.hotSpot.pos, curStep.hotSpot.size);
    let hotSpot = document.getElementById('hotspotLink');
    if (!hotSpot){
        hotSpot = document.createElement('div');
        document.getElementById('demoContainer').appendChild(hotSpot);
        hotSpot.id = 'hotspotLink';
        hotSpot.className = 'hotspot';
    }
    hotSpot.style.display = 'block';
    hotSpot.onclick = ()=>{demoNamespace.goToStep(1)};
    hotSpot.style.width = actualDimensions.size[0] + 'px';
    hotSpot.style.height = actualDimensions.size[1] + 'px';
    hotSpot.style.left = actualDimensions.pos[0] + 'px';
    hotSpot.style.top = actualDimensions.pos[1] + 'px';
    hotSpot.blur();
}
demoNamespace.createTooltip = ()=>{
    let curStep = demoNamespace.steps[demoNamespace.currentStep];
    const actualPosition = demoNamespace.recalculateSizePosition(curStep.tooltip.pos);
    let tooltip = document.getElementById('tooltipElement');
    if (!tooltip){
        tooltip = document.createElement('div');
        document.getElementById('demoContainer').appendChild(tooltip);
        tooltip.id = 'tooltipElement';
    }
    tooltip.style.display = 'block';
    tooltip.className = 'tooltip-black ' + curStep.tooltip.orientation;
    tooltip.dataset.text = curStep.tooltip.text;
    tooltip.style.left = actualPosition.pos[0] + 'px';
    tooltip.style.top = actualPosition.pos[1] + 'px';
}
demoNamespace.hideTooltip = ()=>{
    let tooltip = document.getElementById('tooltipElement');
    if (tooltip){
        tooltip.style.display = 'none';
    }
}
demoNamespace.hideHotSpot = ()=>{
    let hotSpot = document.getElementById('hotspotLink');
    if (hotSpot){
        hotSpot.style.display = 'none';
    }
}
demoNamespace.changeScreen = ()=>{
    let demoImage = document.getElementById('demo-image');
    if (demoImage){
        demoImage.src = 'images/screens/' + demoNamespace.steps[demoNamespace.currentStep].url;
    }
}
document.addEventListener('DOMContentLoaded', function(event) {
    demoNamespace.init();
});