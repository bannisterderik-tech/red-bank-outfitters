# Red Bank Outfitters

A full rebuild of [redbankhunting.com](https://redbankhunting.com) on the design language of the Netlify homepage preview.

**Preview locally**

```bash
cd ~/red-bank-outfitters
python3 -m http.server 8765
# open http://127.0.0.1:8765
```

Regenerate pages from facts:

```bash
python3 build.py
```

`robots.txt` currently disallows crawlers so this preview cannot compete with the live WordPress site.

## Facts used

Assembled from their own pages, the Outdoor Academy about page, and the 2009 Recordnet feature. Nothing invented about rates (call for pricing), guarantees, or current bird counts.

## Photographs

- Lodge, bunkhouse, dining, dogs, clays, guests, deer, hog: from `redbankhunting.com` galleries.
- Oak savanna, creek bluffs, dusk pond, clays stand: generated Tehama scenery, labeled in the gallery. Not presented as their hunts or their buildings.
