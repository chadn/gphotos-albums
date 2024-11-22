// @/lib/googleApi

const apiConfig = {
  // The page size to use for the listing albums request. 50 is max, according to
  // https://photoslibrary.googleapis.com/$discovery/rest?version=v1
  albumPageSize: '50',
  // The API end point to use. Do not change.
  apiEndpoint: 'https://photoslibrary.googleapis.com',
};

interface AlbumData {
  id: string;
  title: string;
  productUrl: string;
  mediaItemsCount: string;
  coverPhotoBaseUrl: string;
  coverPhotoMediaItemId: string;
}

interface GetAlbumsReturn {
  albums: AlbumData[];
  error: string;
}

/*
 * @description Calls the Google Photos API to get all albums
 * @param {string} access_token - token supplied by Google to use API
 * @returns {GetAlbumsReturn}
 */
export async function libraryApiGetAlbums(
  access_token: string
): Promise<GetAlbumsReturn> {
  const ret: GetAlbumsReturn = {
    albums: [],
    error: '',
  };
  const parameters = new URLSearchParams();
  parameters.append('pageSize', apiConfig.albumPageSize);
  parameters.append('access_token', access_token);
  console.debug(
    `Using API cmd: ${apiConfig.apiEndpoint}/v1/albums?${parameters}`
  );

  try {
    // Loop while there is a nextpageToken property in the response until all
    // albums have been listed.
    do {
      console.debug(`Loading albums. Received so far: ${ret.albums.length}`);
      // Make a GET request to load the albums with optional parameters (the
      // pageToken if set).
      const response = await fetch(
        apiConfig.apiEndpoint + '/v1/albums?' + parameters,
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + access_token,
          },
        }
      );
      if (!response.ok) {
        const result = await response.json();
        console.debug('libraryApiGetAlbums - fetch not ok', {
          responseJson: result,
          response: response,
        });
        // Throw a StatusError if a non-OK HTTP status was returned.
        let message = '';
        try {
          // Try to parse the response body as JSON, in case the server returned a useful response.
          message = await response.json();
        } catch (err) {
          // Ignore if no JSON payload was retrieved and use the status text instead.
        }
        throw new Error(`${response.status} ${response.statusText} ${message}`);
      }
      console.debug('libraryApiGetAlbums - fetch ok');

      const result = await response.json();

      console.debug(`Response: ${result}`);

      if (result && result.albums) {
        console.log(`Number of albums received: ${result.albums.length}`);
        // Parse albums and add them to the list, skipping empty entries.
        const items = result.albums.filter((x: AlbumData) => !!x);

        ret.albums = ret.albums.concat(items);
      }
      if (result.nextPageToken) {
        parameters.set('pageToken', result.nextPageToken);
      } else {
        parameters.delete('pageToken');
      }

      // Loop until all albums have been listed and no new nextPageToken is
      // returned.
    } while (parameters.has('pageToken'));
  } catch (err) {
    // Log the error and prepare to return it.
    ret.error = JSON.stringify(err);
    console.error(JSON.stringify({ 'libraryApiGetAlbums Error': err }));
  }

  console.debug(
    JSON.stringify({ 'API response of first album': ret.albums[0] })
  );
  console.log(`${ret.albums.length} Albums loaded from Google Photos API`);
  return ret;
}

/*
 * @description returns json of fake data, same format as real data.
 * @returns {GetAlbumsReturn}
 */
export function getFakeAlbumsData(): GetAlbumsReturn {
  return {
    albums: [
      {
        id: 'AC7OsWZSvKmd_BPEjRBdfHJ5K0MM4UdIqGjVgYLomvo7p7_ztWqDiMy4tSZuspFnS7z2E33Ny69t',
        title: 'Health and Body',
        productUrl:
          'https://photos.google.com/lr/album/AC7OsWZSvKmd_BPEjRBdfHJ5K0MM4UdIqGjVgYLomvo7p7_ztWqDiMy4tSZuspFnS7z2E33Ny69t',
        mediaItemsCount: '65',
        coverPhotoBaseUrl:
          'https://lh3.googleusercontent.com/lr/AAJ1LKeC73tOIqC_bNHCiH9rjOsnogLh4DLALnzfVC_JPSxGAAGdook8UjnX8dZc9aa4gj78xlyIeMua1Ah8mhIfosUW_2zGii7QqUPyS_Bq0Gp0_HtcXUoLTq6AulyomLgyqM2h8r-ZWxxnaChicz0Fprb1sul07B4-FDj4mXczODKv13C1UBWwRYOdIQitvJ2BNNyMmbSlyw6KBqKZPMG5J5nsBKZNvl4zvMiUpLY_LzbJ0dolnPTC_TXT5Fahx7Yeol8EZTGZGkRB26_egdNbWXyz0oC3V1MRUqs25m5ZungE_vCBKKNFPKuKbWk7x-RM25pBoOYq-EdY-fVTMmSJPMTukSBPUjpuz9O-LIHwfwpin54XirWKAqOOkj0d9pi88ICXoJYroAJAGlF3K5IdX0-0VYCsN07OxxDSkKIqkyCTC2DYjbH-P6Fj3wykEBJpNPcioCNON-bOOSTOqMRZIns--GLNcSFTdpIpeCw3tpESCHzUyK3hR-XiL5EXvvH82Eo7AsT8_H01jdQ78dtT34OOs1KtFUsgloZyNuOjOIfu_zBkrQu-e03pLnVY2qULBICWOdJ4nGhV4T0UQ9TDvYA-4bCZU9ZKJvYnJ67ZzQyphFd_diHFfUxZTVsG0ioms1mvoWzPTw_luqdf7nBBifaej5_zcDoJWxJxoMyDIYcp3Xadp9XjoimLt-7OZLZPL-MpRSdG-ZNNu5LVoPJV7X46G3pNuyuDrU8pSr36cD7TEHxH5mfVEY7JtQIR8AAkvfoLbd7T5JrGSkIfG01qqSyfgy0AsHkZAx6kL_M2Qnf8ydznfNpKwm5eotTH-Ot6MstKclcNr5In5PyM6C6cNwhilwj5SKn_VUVT8iVzAiMU6Z-tz5QiyHzyk_4ycph46ZAik5_74ZMxUI0bewO2gPGz2JFKrxH6zZAmu4eQ33XL4-H5nvxTtw1GQ5F7iH2GBzWMvgZLM9a9msHakZUDpl-sz3xs9uN0DNU',
        coverPhotoMediaItemId:
          'AC7OsWaZEnhJiCyuV9kD8tUxOWTf4V7kD2vfGjSS1nqAfnuEhI9NG5gSwYesRXYMEnpX14H-j_AwWuW9sBz8NPTJJk0_LA3fJw',
      },
      {
        id: 'AC7OsWbf1Z0b_jjtd4mkQzyuxO6wW67qJsBiI9M5ZIriAPhaBrC_qaNqevxaj2kRMWkK20Sj7Mm8',
        title: '1049 Sunsets',
        productUrl:
          'https://photos.google.com/lr/album/AC7OsWbf1Z0b_jjtd4mkQzyuxO6wW67qJsBiI9M5ZIriAPhaBrC_qaNqevxaj2kRMWkK20Sj7Mm8',
        mediaItemsCount: '64',
        coverPhotoBaseUrl:
          'https://lh3.googleusercontent.com/lr/AAJ1LKeYB_mzq6-IvSmZ5WHozg__uobqH7H5l3eyla036ndjX9UBngPk3T0Cks-K5yMuP3n961nnrorel0eXS7cNnbGsmLwua7EMaW01UD_XeNBcj0Poscj2Gl72d2AxB86Y6WjRb6WWY3K5aFWoaHefFRStpobJHK5IGv-0l4DDsZvtihYm-QZjt6B-enrSNzl-T2xOBUqUuqcx_m6E19qANae6gviyCvLhgfEnAMpuqANRK2JXT8UWr_C5iZOw9-im_1AYA0SKps6N7YR9IrTfkjgY4mJ05lm7nfMD5zcYs3sYRWBpqvlvn3GvS9NOWqW0TR3WZPs1K3cg39iD4zLtQs4johpjvhtnWePPBuC1oCHni4_ckbct768zs_-HAfm7MPGLeqma_F1NxWO8ieu66l32RMfQXS44epBFknlBm7-cj8xSG2t7WnJCFMK3kWOFkhOuYJJLnbgq02LmCPH-GBDttFOVP_pRotk_Af3d-I0vwqWuM6OY4UXDDzLXgN5sUBCxd-rEKKvGhautSmu36RuCAHoHx7BMyPSiX_8WobarR91sb9zzE0fmfnuMIcyq02wD-S8oAlP0TD3fDv6heqc4M4Q_7lyPOxYNoK1aEnerubDecvwBPD5P89luoKNiZ5_5NK__iRRrZ491e4wdSP0Jg-vc965gNR4i0WUjwDEqZelviT2bTJmtCxwzU5UjbvLOr56O8RXfpVR2I5YOBTaMwh_ff_F3riVblAaZ5-3hGP8jmLi4vMJzSinNlh-kF1jgiFT_TXRsdBQNwu_NLAZbS8YxmUuJbhBydX_TVFL6dHPMPA4wVU0yLjevL3RKTI5xcl_in6Enmukwtna08Whn064K8QJGUu3_DXbw7L19-ezEeKkHoKnzXgzG84x66QZiuWIsGa9op5Gs22Z3tpD1GIP72Uc2cVo8X9H9T-qYDBX1fbrUQYoJKJYTwikrNXYLU9O6Ji58Lpyt99cHiQf1AaQOrVtkS7U',
        coverPhotoMediaItemId:
          'AC7OsWbe7leJvhG5NSfWOU8H9qqweRojIBCeWlTEYvT8SdpIXl7iuc2JF90Kd0fB-En-c6JyLbs0gde_CSDQhVGwsa8hquyTkw',
      },
      {
        id: 'AC7OsWYwemtD9GbS9pMXBx4ynWaufWmkSuK6nGZRF2X7OxIi_A6fnLr6kZA6YUYWGbmEk7Ln63V0',
        title: 'Best of 2024',
        productUrl:
          'https://photos.google.com/lr/album/AC7OsWYwemtD9GbS9pMXBx4ynWaufWmkSuK6nGZRF2X7OxIi_A6fnLr6kZA6YUYWGbmEk7Ln63V0',
        mediaItemsCount: '4',
        coverPhotoBaseUrl:
          'https://lh3.googleusercontent.com/lr/AAJ1LKeRwkpctR4RtSY6UJ59W7NhPSRT3yoWS8XEp5j2UsLU91PZqS8D8zIRkA1gU0a62vNvFQ_QcOBmSLsc7bWuU3bJIZX0pfhn95ONVfbsmTJz6dTgbGGmSgz8niKCp_wdlsOQ32bOooLXEL3bBisrUN4F3CEqQO-Qs-RQm7_j-cScY2P5OqvBPD2GZQrmM73rWor7Z8HZzGetUwzWlQeFIg78WFht3T2s1sCRiegRbfJ-8AuaQ52ln0-zMwLScAlm5iC2G92SJ4YlU-Tq5TX-dsGanD5tbkwt1wV2SCLyt2tnigT-rWHNkz2vI_6NLPKFAOHyX61WnjrrM95IhaxZsryixJAVGg9WxpUx6x3uLGyobDcEk3JHnZVe80drdB2ddwP8ZGD3EuJCq2VIU_-tfxbOmYJTynCG8LFHqRScnwXuI5sMh1wTPnDtj7PT42zdvz8ryKnJ0MBiheJFMr1ndpC9UdoyKydXZn07hEiZklVWNHOLdVgUFwqv_VqYpl3UMS-orcJ-l4wYaaV66hgLkNsKTsbOGcLfDN9ZQC_EHPi3W_smGrLyLZnQHCLjQDDFdpoqefZ2QboFBOgs3aWO_aLDXnFJzgXP5BOoZCx2BJw_VQ3Jq1_X7CCGlJfFNHinCBOInsrb1S6507CH9m0LTnJmcYQ2F9qcrms_XTG8yAvKFpSNlCFjg_5HhZCUZHAS9eGRG-u9a11-kqZsF5qIEYVteDqaL02-QNIaXxIAljG8VuNrno4L9y22GHwkOnRtvbVbY2cLzZz18WJugWPTirJqIBMWCjLCINFZ591AJtpxuF0AxDB_GdrYALHsWI_kPl4wBD7wyDBis93SZIc0WB3qh6Ej4-9hKmKocwL5F5_8udlEiJesDMfL2S5vp7Z4rYRyMTI1iY2nRj6qS5FYvE0KXRnl0OaaT_qof0yxLSW8Kfhi9FDECD1nH0pLmirw0MNxKxoPgT_P0jLhX429aFQI0XNizeHfIQc',
        coverPhotoMediaItemId:
          'AC7OsWarG8V6DED5ihhK1_0GjM5QUO-qT0SIlJtLFjLdhjWKcqJ2dEGC7V3w4BU1PsFMt5M1_oz2GRSm3xnXbq0kN5fRjOQuGQ',
      },
    ],
    error: '',
  };
}
