import React from 'react';
import styles from './master-detail.module.css';
const Discord = require('discord.js')
const client = new Discord.Client();
const BOT_TOKEN = "NDMzMTc4MjY5NjI2NDAwNzY4.XmjMwQ.nubHhCjf6L45lkdLVbc3ENdjhmg"

export default class BotView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientConnected: false,
            clientListening: false,
            currentMessage: "Idle.",
            guilds: {},
            channels: {},
            guildChannels: {},
            selectedGuild: null,
            selectedChannel: null,
            messageArray: null,
            messageInput: ""
        };

        this.updateMessageInput = this.updateMessageInput.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    tick() {

    }

    startDiscordBot() {
        this.setState((state, props) => ({
            currentMessage: "Connecting..."
        }));
        
        // Client logon code (update guilds and channels in state)
        client.on('ready', () => {
            this.setState((state, props) => ({
                currentMessage: "Connected as " + client.user.tag + "!",
                clientConnected: true
            }));

            // Guilds is updated with each guild the bot is connected to
            client.guilds.cache.forEach((guild) => {    
                this.setState(prevState => {
                    let guilds = Object.assign({}, prevState.guilds);
                    guilds[guild.id] = guild;
                    return { guilds };
                });
            })
            console.log(this.state.guilds);
            
            // Channels is updated with each channel the bot is connected to
            client.channels.cache.forEach((channel) => {    
                this.setState(prevState => {
                    let channels = Object.assign({}, prevState.channels);
                    channels[channel.id] = channel;
                    return { channels };
                });    
            })
            console.log(this.state.channels);
        });
        client.login(BOT_TOKEN);
    }

    startListeningToMessages(){
        if(this.state.clientListening === true){
            return;
        } else {
            client.on('message', (receivedMessage) => {
                this.setState((state, props)=>({
                    clientListening : true
                }), ()=>{
                    console.log(receivedMessage)
                    this.updateMessages();
                });
            })
        }
    }

    // Let the state know that a guild has been selected
    selectGuild(id){
        this.setState((state, props) => ({
            selectedGuild: this.state.guilds[id]
        }), ()=>this.createChannelListForGuild(this.state.selectedGuild));
    }

    // Create a channel list for a selected guild
    createChannelListForGuild(guild){
        console.log(guild)
        this.setState((state, props) => ({
            guildChannels: guild.channels.cache
        }), ()=>console.log(this.state.guildChannels))
    }

    // Let the state know that a channel has been selected
    selectChannel(id){
        console.log(id);
        this.setState((state, props) => ({
            selectedChannel: this.state.channels[id]
        }), ()=>{
            this.updateMessages();
            this.startListeningToMessages();
        })
    }

    // Place messages of channel in state
    updateMessages(){
        if(this.state.selectedChannel != null){
            this.state.selectedChannel.messages.fetch({ limit: 30 })
                .then(messages => {
                    var messageArray = Array.from(messages.values());
                    console.log(messageArray);
                    this.setState((state, props)=>({
                        messageArray: messageArray.reverse()
                    }));
                })
                .catch(console.error);
        }
    }

    // Update the text area for message input
    updateMessageInput(event){
        this.setState({
            messageInput : event.target.value
        });
    }

    // Send the message in the text area
    sendMessage(event){
        if(this.state.messageInput !== ""){
            console.log("Trying to send "+this.state.messageInput);
            this.state.selectedChannel.send(this.state.messageInput);
            this.setState((state, props)=>({messageInput: ""}));
            this.updateMessages();
        }
        event.preventDefault();
    }

    render() {
        // Create list items for each guild
        var guildList = null;
        if(this.state.clientConnected === true){
            guildList = Object.keys(this.state.guilds).map((guildId) =>
                <li key={guildId} onClick={() => this.selectGuild(guildId)}>{this.state.guilds[guildId].name}</li>
            );
        }

        // Create list items for each channel in the guild
        var channelList = null;
        if(this.state.selectedGuild != null){
            channelList = Array.from(this.state.guildChannels).map(([channelId, channel]) =>{
                if(channel.type === "text")return <li key={channelId} onClick={() => this.selectChannel(channelId)}>{channel.name}</li>
            });
        }

        // Display all messages in the channel
        var messageList = null;
        if(this.state.messageArray != null){
            messageList = this.state.messageArray.map((message) =>
                <li key={message.id}>{message.author.username}: {message.content}</li>
            );
        }

        return (
            <div className={styles.container}>
                {this.state.clientConnected ? <div className={styles.discordAppAside}>
                    <div>
                        <h3>Guilds</h3>
                        <ul>{guildList}</ul>
                    </div>
                    <div>
                        <h3>Channels</h3>
                        <ul>{channelList}</ul>
                    </div>
                </div>: null}
                <main>
                    <div className={styles.discordApp}>
                        <div className={styles.discordAppHeader}>
                            {this.state.selectedChannel == null ? null : 
                            <h3>Connected to channel {this.state.selectedChannel.name} in {this.state.selectedChannel.guild.name}</h3>
                            }
                            <p>Status: {this.state.currentMessage}</p>
                        </div>
                        
                        {this.state.clientConnected ? null : <button onClick={() => this.startDiscordBot()}>Start Bot</button>}
                        <ul>{messageList}</ul>
                        {this.state.selectedChannel == null ? null : 
                        <form onSubmit={this.sendMessage}>
                            <input type="text" value={this.state.messageInput} onChange={this.updateMessageInput}></input>
                            <input type="submit" value="Send"></input>
                        </form>
                        }
                    </div>
                </main>
            </div>
        );
    }
}