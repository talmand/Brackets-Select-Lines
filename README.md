## Brackets Select Line extension

Simple extension to allow selecting lines by SHIFT-clicking in the gutter.

To install this extension:
In Brackets, under "Help" select "Show Extensions Folder". Place extension folder with files inside the "user" folder.

Older versions of Brackets this choice might be under "Debug" or might not exist at all.

Or just use the Extension Manager within Brackets.


## Usage

If installed it is always active.
Hold down SHIFT and click next to a line in the gutter to select that line.
Continue holding down SHIFT and click next to a second line in the gutter to select that line and all lines from the first line selected.
Continuing to click lines after the second selection will reset the second selection to the new line and retain the original first click to change the selection range.
Release SHIFT to stop selecting and carry on as usual.


## Known issues

None so far.

## Things to do

I really wanted to make this work like it does commonly in word processors in that you click and drag to select lines. So far I've made it work that way in a couple different ways but it always didn't work quite the way I wanted. Often convincing it stop selecting has proved bothersome using various javascript events. Maybe one day, but this works nicely as is and likely won't conflict with any future extensions that make use of the gutter.