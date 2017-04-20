# Getting Started with the Looker Visualization API

####Preliminaries:
1. In order to utilize Looker's visualization plugin, a license feature must first be enabled. Use in-app chat, email support, or email a Looker analyst and ask them to turn on this feature. Once this is done, you will need to update your license key in the admin panel. [This "how to" article discusses the setup steps in detail](https://discourse.looker.com/t/how-to-make-custom-visualizations-3-16-requires-javascript-self-hosting).
2. At present, only on-premise (*i.e.*, customer hosted) Lookers support custom visualizations. This is because one needs access to the file system to add and remove custom JavaScript.
3. Looker's Customer Support team does not troubleshoot *any* issues that pertain to custom visualizations. Custom visualizations are a community supported effort. Please use issues for tracking and closing out bugs, and visit https://discourse.looker.com for how-to articles, conversations, and tips regarding custom visualizations.

####Getting Started:
Looker versions 3.14.xx and later ship with a directory intended to hold scripts for custom visualizations and other extensions. It is located on the machine hosting looker: ```~/looker/plugins/visualizations```. This is where you'll find our heatmap example to get you started. You will need to read and edit the heatmap example file to use it.

Once a custom visualiation script is saved in the above-mentioned directory, you can use it in the explore section or a dashboard by selecting it within the visualiation editor in list of additional visualiations (the ellipsis).

![ScreenShot](http://s13.postimg.org/hg3h4fdjb/location.jpg?raw=true)

Which looks like this:

![ScreenShot](https://s8.postimg.org/n87cxkbid/Screen_Shot_2015-03-25_at_8.21.59_AM.png)
