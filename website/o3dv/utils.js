OV.GetNameOrDefault = function (originalName, defaultName)
{
    if (originalName.length > 0) {
        return originalName;
    }
    return defaultName;
};

OV.GetMeshName = function (originalName)
{
    return OV.GetNameOrDefault (originalName, 'No Name');
};

OV.GetMaterialName = function (originalName)
{
    return OV.GetNameOrDefault (originalName, 'No Name');
};

OV.IsHoverEnabled = function ()
{
    if (window.matchMedia ('(hover : hover)').matches) {
        return true;
    } else {
        return false;
    }
};

OV.IsSmallWidth = function ()
{
    if (window.matchMedia ('(max-width : 700px)').matches) {
        return true;
    } else {
        return false;
    }
};

OV.IsSmallHeight = function ()
{
    if (window.matchMedia ('(max-height : 700px)').matches) {
        return true;
    } else {
        return false;
    }
};

OV.InstallTooltip = function (item, text)
{
    function CalculateOffset (item, tooltip)
    {
        let windowObj = $(window);
        let windowWidth = windowObj.outerWidth (true);

        let itemOffset = item.offset ();
        let itemWidth = item.outerWidth (true);
        let itemHeight = item.outerHeight (true);
        let tooltipWidth = tooltip.outerWidth (true);
        
        let tooltipMargin = 10;
        let left = itemOffset.left + itemWidth / 2 - tooltipWidth / 2;
        if (left + tooltipWidth > windowWidth - tooltipMargin) {
            left = windowWidth - tooltipWidth - tooltipMargin;
        }
        if (left < tooltipMargin) {
            left = tooltipMargin;
        }
        left = Math.max (left, 0);
        return {
            left : left,
            top : itemOffset.top + itemHeight + tooltipMargin
        };
    }

    if (!OV.IsHoverEnabled ()) {
        return;
    }
    
    let bodyObj = $(document.body);
    let tooltip = null;
    item.hover (
        function () {
            tooltip = $('<div>').html (text).addClass ('ov_tooltip').appendTo (bodyObj);
            tooltip.offset (CalculateOffset (item, tooltip));
        },
        function () {
            tooltip.remove ();
        }
    );
};

OV.CopyToClipboard = function (text)
{
    let input = document.createElement ('input');
    input.style.position = 'absolute';
    input.style.left = '0';
    input.style.top = '0';
    input.setAttribute ('value', text);
    document.body.appendChild (input);
    input.select ();
    document.execCommand ('copy');
    document.body.removeChild (input);
};

OV.CreateIconButton = function (iconName, hoverIconName, title, link)
{
    let buttonLink = $('<a>');
    buttonLink.attr ('href', link);
    buttonLink.attr ('target', '_blank');
    buttonLink.attr ('rel', 'noopener noreferrer');
    OV.InstallTooltip (buttonLink, title);
    let imgElem = $('<img>').attr ('src', iconName).appendTo (buttonLink);
    if (hoverIconName !== null && OV.IsHoverEnabled ()) {
        buttonLink.hover (
            function () {
                imgElem.attr ('src', hoverIconName);
            },
            function () {
                imgElem.attr ('src', iconName);
            }
        );
    }
    return buttonLink;
};

OV.CreateHashParameters = function (urls, camera)
{
    let hashParameters = '';
    let urlsHash = urls.join (',');
    hashParameters += 'model=' + urlsHash;
    if (camera !== null) {
        let precision = 5;
        let cameraHash = [
            camera.eye.x.toPrecision (precision), camera.eye.y.toPrecision (precision), camera.eye.z.toPrecision (precision),
            camera.center.x.toPrecision (precision), camera.center.y.toPrecision (precision), camera.center.z.toPrecision (precision),
            camera.up.x.toPrecision (precision), camera.up.y.toPrecision (precision), camera.up.z.toPrecision (precision)
        ].join (',');
        hashParameters += '$camera=' + cameraHash;
    }
    return hashParameters;
};
