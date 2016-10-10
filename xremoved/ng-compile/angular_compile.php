<?php
/**
 * This script calls composer-compiler to produce a minified and combined JS file out of all the JS files under angular/
 * It also uses the compiler manifect to create a combined, but unminified, version of the file
 */

if (php_sapi_name() !== 'cli') {
    die;
}

echo "calling compiler.jar...\n";

exec('java -jar compiler.jar --js `find ../ng -type f -name "*.js"` \
--js_output_file ../js/dev-ctrl.min.js --closure_entry_point "DevCtrl.App" \
--language_in=ECMASCRIPT5 --output_manifest dev-ctrl.manifest', $output, $ret);

if ($ret) {
    error_log("closure-compile error");
    return $ret;
}

$included_files = file("dev-ctrl.manifest");

$source_lines = array();
foreach ($included_files as $file) {
    $file = trim($file);
    array_push($source_lines, "\n// $file\n");
    $source_lines = array_merge($source_lines, file($file));
}

$provided = array();
$output = array();
foreach ($source_lines as $line) {
    if (preg_match("/goog.provide\\(['\"]([\w.]+)['\"]\\);/", $line, $matches)) {
        $provided_class = $matches[1];
        $components = explode(".", $provided_class);

        // Add initialization for provided path components
        for ($i = 0; $i < count($components) - 1; $i++) {
            $subcomp = implode(".", array_slice($components, 0, $i + 1));

            if (empty($provided[$subcomp])) {
                array_push($output, "$subcomp = {};\n");
                $provided[$subcomp] = true;
            }
        }
    }
    elseif(preg_match("/^goog.require/", $line)) {
        // Just skip this line.  closure-compiler did everything needed for this when it gave us the manifest
    }
    else {
        array_push($output, $line);
    }
}

echo "line 173: " . $output[173];
$outfile = "../js/dev-ctrl.js";
unlink($outfile);
$bytes_written = file_put_contents($outfile, $output);
echo "$bytes_written bytes written to $outfile";