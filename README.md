## Sinor Menu
- A grid style menu system that works with both QB and ESX frameworks. features a beautiful style grid layout with smooth animations.

## Features
- works with QB And ESX
- grid layout
- smooth animations
- simple API for any resource
- multiple input events, exports, and commands

## Installation
- The menu will automatically detect your framework (QB-Core/ESX) or work in standalone mode "not tested in standalone".
- Add this resource to your `server.cfg` :

`ensure sinor-menu`

## Usage:
# 1: events:

```lua
-- basic menu example
local menuData = {
    {
        header = "🎮 My Menu Title",
        txt = "Menu description or instructions",
        isMenuHeader = true  -- true = title
    },
    {
        header = "Option 1",
        txt = "Description for option 1",
        icon = "fas fa-car",
        params = {
            event = "my-resource:client:option1",
            args = {data = "example"}
        }
    },
    {
        header = "Option 2",
        txt = "Description for option 2", 
        icon = "path/to/image.png",
        params = {
            event = "my-resource:client:option2",
            args = {data = "test"}
        }
    },
    {
        header = "Server Event",
        txt = "Trigger server-side event",
        icon = "fas fa-server",
        params = {
            event = "my-resource:server:serverEvent",
            isServer = true,
            args = {playerId = GetPlayerServerId(PlayerId())}
        }
    },
    {
        header = "Close Menu",
        txt = "Close this menu",
        icon = "fas fa-times",
        params = {
            event = "sinor-menu:client:closeMenu"
        }
    }
}
-- Open the menu
TriggerEvent('sinor-menu:client:openMenu', menuData)
```
# 2: Exports:

```lua
exports('openMenu', openMenu)
exports('closeMenu', closeMenu)
exports('showHeader', showMenuHeader)
```
# 3: Server-side menu triggering:

```lua
-- example server side code to open menu for player
RegisterNetEvent('my-resource:server:openPlayerMenu', function(playerId)
    local menuData = {
        {
            header = "Admin Menu",
            txt = "Player management options",
            isMenuHeader = true
        },
        {
            header = "Heal Player",
            icon = "fas fa-heart",
            params = {
                event = "my-resource:server:healPlayer",
                isServer = true,
                args = {target = playerId}
            }
        }
    }
    TriggerClientEvent('sinor-menu:client:openMenu', playerId, menuData)
end)
```
# 4: Menu Item Parameters
- basic Structure
```lua
{
    header = "Item Name",        -- required: Display name
    txt = "Description",         -- Optional: Item description
    icon = "fas fa-icon",        -- Optional: Icon (FA or image path)
    isMenuHeader = false,        -- Optional: Set to true for title
    disabled = false,            -- Optional: Disable the item
    params = {                   -- required: Action parameters
        event = "event-name",    -- Event to trigger
        args = {},               -- arguments to pass
        isServer = false,        -- true for server event
        isCommand = false,       -- true for command
        isAction = false         -- true for function call
    }
}
```
# 5: Parameter Types
- Client Event:

```lua
params = {
    event = "client-event",
    args = {data = "example"}
}
```
- Server Event:

```lua
params = {
    event = "server-event", 
    isServer = true,
    args = {playerId = 1}
}
```
- Command:

```lua
params = {
    event = "command",
    isCommand = true,
    args = "command parameters"
}
```
- Function Call:

```lua
params = {
    event = function(args)
        print("Menu item clicked!", args)
    end,
    isAction = true,
    args = {custom = "data"}
}
```

# 6: Custom Integration: 
- example:

```lua
RegisterNetEvent('resource:openMenu', function(data)
    local formattedMenu = {}
    for _, item in ipairs(data) do
        table.insert(formattedMenu, {
            header = item.label,
            txt = item.description,
            icon = item.icon,
            params = {
                event = item.event,
                args = item.args
            }
        })
    end
    TriggerEvent('sinor-menu:client:openMenu', formattedMenu)
end)
```

## Customization:
- you can customize these css properties:

```css
/* positioning */
#container {
    top: 30%;                               /* vertical position */
    right: 3%;                              /* horizontal position */
}

/* grid layout */
#grid-container {
    width: 900px;                           /* menu width */
    grid-template-columns: repeat(5, 1fr);  /* items per row */
    gap: 12px;                              /* spacing between items */
}

/* item styling */
.grid-item {
    min-height: 140px;                      /* item height */
    background: linear-gradient();          /* background color */
}
```
## Support and questions :

- check README first.
- verify your event names and parameters.
- ensure all dependencies are loaded.
- other wise join our discord server, you can find it in our tebex store.

## Note :


- This menu is largely based on qb-menu code to simplifies adaptation for developers and server owners by drawing inspiration from qb-menu/ox_lib and other popular ones.
