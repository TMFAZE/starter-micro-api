import discord
from discord.ext import commands
from discord.utils import get
import youtube_dl

bot = commands.Bot(command_prefix='!')

@bot.command()
async def join(ctx):
    channel = ctx.message.author.voice.channel
    await channel.connect()

@bot.command()
async def leave(ctx):
    await ctx.voice_client.disconnect()

@bot.command()
async def play(ctx, url):
    song = os.path.isfile("song.mp3")
    try:
        if song:
            os.remove("song.mp3")
    except PermissionError:
        await ctx.send("Wait for the current playing music to end or use the 'stop' command")
        return

    voiceChannel = discord.utils.get(ctx.guild.voice_channels, name=str(ctx.author.voice.channel))
    await voiceChannel.connect()
    voice = get(bot.voice_clients, guild=ctx.guild)

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': 'song.mp3',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    voice.play(discord.FFmpegPCMAudio("song.mp3"))

@bot.command()
async def stop(ctx):
    voice = get(bot.voice_clients, guild=ctx.guild)
    voice.stop()

bot.run('bb502c1384b6bce9918733ca55fec01f1b5acfe38adf382b3db48af208832ce3')
