# Thoracic Evidence Atlas (simple version)

A learning website for thoracic oncology trials: NSCLC, SCLC, thymic tumours and mesothelioma.
Built with only **HTML, CSS and JavaScript**: no installation, no server, no database.

## How to open it

1. Download this `simple-site` folder (on GitHub: green **Code** button → **Download ZIP**, then unzip).
2. Double-click **`index.html`**. It opens in your web browser. That's it.

Or open the single file `thoracic-evidence-atlas.html`, which contains the whole site in one file
(easy to email to yourself or put on a phone).

## What's inside

| File | What it does | Edit it to… |
|---|---|---|
| `index.html` | The page skeleton and top menu | rename menu items |
| `css/styles.css` | Colours, fonts, spacing | change a colour (the `:root` section at the top) |
| `js/app.js` | Draws every page from the data | change wording on pages |
| `js/data.js` | All trials, biomarkers, drugs | **don't edit by hand** (see below) |

### Changing a colour (a good first edit)
Open `css/styles.css` in any text editor (even Notepad or TextEdit). Near the top you'll see lines like:

```css
--nsclc: #dcecff;   --nsclc-ink: #0b4f9c;
```

`#dcecff` is the pastel blue behind NSCLC. Replace it with another colour code (search "colour picker" in
Google to find codes), save, and refresh the browser.

## Where the numbers come from

Every result (hazard ratio, confidence interval, median, P value, response rate) was copied from the
trial's **PubMed abstract**. The site shows the **exact quote** next to each number ("Show exact quote")
and a PubMed link. All values are marked **"Awaiting verification"** until a clinician checks them against
the full paper. Doses are not shown; always check the current drug label.

`js/data.js` is generated from the curated files in the main project's `content/` folder with:

```bash
node scripts/build-simple-data.mjs          # rebuild js/data.js
node scripts/build-simple-single-file.mjs   # rebuild the one-file version
```

For learning only. Not medical advice.
