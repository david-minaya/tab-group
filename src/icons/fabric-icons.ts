// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license

// tslint:disable:max-line-length

import {
  IIconOptions,
  IIconSubset,
  registerIcons
} from '@uifabric/styling';

export function initializeIcons(
  baseUrl: string = '',
  options?: IIconOptions
): void {
  const subset: IIconSubset = {
    style: {
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontStyle: 'normal',
      fontWeight: 'normal',
      speak: 'none'
    },
    fontFace: {
      fontFamily: 'FabricMDL2Icons',
      src: `url('${baseUrl}fabric-icons.woff') format('woff')`
    },
    icons: {
      'AddIn': '\uF775',
      'Cancel': '\uE711',
      'Copy': '\uE8C8',
      'Delete': '\uE74D',
      'More': '\uE712',
      'OpenInNewTab': '\uF6AB',
      'Save': '\uE74E'
    }
  };

  registerIcons(subset, options);
}
