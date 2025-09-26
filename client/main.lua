local framework = nil
local QBCore, ESX = nil, nil
local headerShown = false
local sendData = nil

CreateThread(function()
    while framework == nil do
        if GetResourceState('qb-core') == 'started' then
            QBCore = exports['qb-core']:GetCoreObject()
            framework = 'qb'
            break
        elseif GetResourceState('es_extended') == 'started' then
            ESX = exports['es_extended']:getSharedObject()
            framework = 'esx'
            break
        else
            framework = 'standalone'
            break
        end
        Wait(100)
    end
end)

RegisterNetEvent('QBCore:Client:UpdateObject', function() 
    if GetResourceState('qb-core') == 'started' then
        QBCore = exports['qb-core']:GetCoreObject()
        framework = 'qb'
    end
end)

RegisterNetEvent('esx:playerLoaded', function() 
    if GetResourceState('es_extended') == 'started' then
        ESX = exports['es_extended']:getSharedObject()
        framework = 'esx'
    end
end)

local function openMenu(data, sort, skipFirst)
    if not data or not next(data) then return end
    SetNuiFocus(true, true)
    headerShown = false
    sendData = data
    SendNUIMessage({
        action = 'OPEN_MENU',
        data = table.clone(data)
    })
end

local function closeMenu()
    sendData = nil
    headerShown = false
    SetNuiFocus(false)
    SendNUIMessage({
        action = 'CLOSE_MENU'
    })
end

local function showMenuHeader(data)
    if not data or not next(data) then return end
    headerShown = true
    sendData = data
    SendNUIMessage({
        action = 'SHOW_HEADER',
        data = table.clone(data)
    })
end

RegisterNetEvent('sinor-menu:client:openMenu', function(data, sort, skipFirst)
    openMenu(data, sort, skipFirst)
end)

RegisterNetEvent('sinor-menu:client:closeMenu', function()
    closeMenu()
end)

RegisterNUICallback('clickedButton', function(option, cb)
    if headerShown then headerShown = false end
    SetNuiFocus(false)
    if sendData then
        local data = sendData[tonumber(option)]
        sendData = nil
        if data and data.params then
            if data.params.event then
                if data.params.isServer then
                    TriggerServerEvent(data.params.event, data.params.args)
                elseif data.params.isCommand then
                    ExecuteCommand(data.params.event)
                elseif data.params.isAction then
                    data.params.event(data.params.args)
                else
                    TriggerEvent(data.params.event, data.params.args)
                end
            end
        end
    end
    cb('ok')
end)

RegisterNUICallback('closeMenu', function(_, cb)
    headerShown = false
    sendData = nil
    SetNuiFocus(false)
    cb('ok')
    TriggerEvent("sinor-menu:client:menuClosed")
end)

RegisterCommand('menufocus', function()
    if headerShown then
        SetNuiFocus(true, true)
    end
end)

RegisterKeyMapping('menuFocus', 'Give Menu Focus', 'keyboard', 'LMENU')

exports('openMenu', openMenu)
exports('closeMenu', closeMenu)
exports('showHeader', showMenuHeader)