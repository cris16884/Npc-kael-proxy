Hello
----------------
go to vercel and import my repository now go to roblox and paste this code
___________________________________________________________________________

-- ==========================================================
--            CEREBRO DEL NPC CON CONEXIÓN A VERCEL
-- ==========================================================

local npc = script.Parent
local npcHead = npc:WaitForChild("Head")

local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")

-- !!! IMPORTANTE: Pega aquí la URL de tu proyecto de Vercel !!!
local VERCEL_URL = "https://TU-PROYECTO.vercel.app/api/ask" -- Reemplaza esto

-- ==========================================================
--            LÓGICA DE INTERACCIÓN CON LA IA
-- ==========================================================

local function onPlayerChatted(player, message)
	local playerCharacter = player.Character
	if not playerCharacter or not playerCharacter:FindFirstChild("HumanoidRootPart") then return end

	local distancia = (player.Character.HumanoidRootPart.Position - npc.HumanoidRootPart.Position).Magnitude
	if distancia > 40 then return end

	ChatService:Chat(npcHead, "...", Enum.ChatColor.White)

	local data = {
		message = message
	}
	local body = HttpService:JSONEncode(data)

	local success, result = pcall(function()
		return HttpService:PostAsync(VERCEL_URL, body, Enum.HttpContentType.ApplicationJson)
	end)

	if success then
		if result then
			local responseData = HttpService:JSONDecode(result)
			if responseData and responseData.response then
				ChatService:Chat(npcHead, responseData.response, Enum.ChatColor.White)
			else
				ChatService:Chat(npcHead, "Perdona, me he perdido en mis pensamientos.", Enum.ChatColor.Red)
			end
		end
	else
		print("Error al conectar con Vercel: ", result)
		ChatService:Chat(npcHead, "Mi mente está... en otro lugar ahora mismo. Inténtalo más tarde.", Enum.ChatColor.Red)
	end
end

-- Conectar el evento a los jugadores
Players.PlayerAdded:Connect(function(player)
	player.Chatted:Connect(function(message) onPlayerChatted(player, message) end)
end)
