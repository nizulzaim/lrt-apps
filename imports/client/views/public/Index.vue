<template>
	<register-login-wrapper>
		<div class="row center-xs middle-xs" style="min-height: 100vh;">
			<div class="col-md-fluid-7 col-lg-6">
				<cards v-depth="3">
					<form @submit.prevent="loginSubmit">
						<div style="max-width: 200px; margin: 20px auto;">
							<img class="img-responsive" src="/img/logo.png" alt="">
						</div>
						<cards-content>
							<textfield placeholder="Username" v-model="user.username" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textfield>
							<textfield type="password" placeholder="Password" v-model="user.password"></textfield>
						</cards-content>
						<divider></divider>
						<cards-action>
							<div class="pull-right">
								<color-button v-ripple class="primary" type="submit">
									<icon name="account"></icon>Sign In
								</color-button>
							</div>
						</cards-action>
					</form>
				</cards>
				<div class="button-center-container">
					<div class="color-grey-200 font-center no-margin">Dont have Account Yet?</div>
					<router-link to="/register">
						<flat-button class="white no-margin" v-ripple>
							Register for Free
						</flat-button>
					</router-link>
				</div>
			</div>
		</div>
	</register-login-wrapper>
</template>

<script>
	import {
		User
	} from "/imports/model/User.js";
	import {
		Meteor
	} from 'meteor/meteor';
	
	export default {
		data() {
			return {
				user: {
					username: "",
					password: "",
				}
			}
		},
		mounted() {
			if (Meteor.userId()) {
				this.$router.push("/dashboard/")
			}
		},
		methods: {
			loginSubmit() {
				if (this.user.username === "" || this.user.password === "") {
					this.$snackbar.run("Username or password is empty", () => {}, "OK", "error");
					return;
				}
				Meteor.loginWithPassword(this.user.username, this.user.password, (err) => {
					if (err) {
						this.$snackbar.run("Incorrect username or password", () => {}, "OK", "error");
						return;
					}
					this.$snackbar.run("Welcome to LRT ticket apps", () => {});
					this.$router.replace("/dashboard/");
				})
			}
		}
	}
</script>