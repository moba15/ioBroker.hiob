![Logo](../../admin/hiob.png)

-   [Back to Summary](/docs/en/README.md)
-   [Step 1: Installation and APP setup](app.md)
-   [Step 2: Create Enums](enum.md)
-   [Step 3: Create Widgets](widgets.md)
-   [step 4: Create Screens](sreens.md)
-   [Step 5: Create Backups](backups.md)

## Installation and APP setup `ioBroker Settings`

# Step 1: Installation and APP setup

# Step 1: Instance Settings

1. Please enter a free port (default is 8090). If the selected port is occupied, the next free port will be used. This is written to the log and should then be copied into the config instance.
2. For the graphic widget you need either the SQL or Histroy adapter to record changes to states. Please select either a SQL or History instance.
3. Now start the adapter.

![instance.png](img/instance.png)

# Step 2: Create User (OPTIONAL)

## A new user must be created for password login

1. Select users on the left and add users on the right.

![create_user.png](img/create_user.png)

2. Enter the username and a password here. Then press save.

![create_user_with_pw.png](img/create_user_with_pw.png)

# Step 3 with password: Login with password (local login)

1. Enter the IP of your ioBroker, port, user and password here and press the “Reconnect” button.

![app_login_first.png](../de/img/app_login_first.png)

2. Then under Objects, set the state `approved`, from the correct device, to true (without the Confirmed check mark)

![request_approved_wo_pw.png](img/request_approved_wo_pw.png)

3. Stimmt das Passwort oder der Username nicht wechselt der Datenpunkt wieder auf false und in der APP wird ein roter Text `Login declined` angezeigt. Bitte dann den Username und Passwort überprüfen und den Datenpunkt erneut auf true setzen.

4. If everything has been entered correctly, the green text “Logged in” will now appear.

![app_login_with_pw.png](../de/img/app_login_with_pw.png)
![approved_with_pw.png](../de/img/approved_with_pw.png)

5. (Optional) Now a forwarding can be entered so that you can also switch outside the network. Beforehand, the APP must receive the “Location” access rights. Then enter the WiFi network and the URL. Now set up a forwarding in the Fritzbox. But this is not recommended!! VPN access would be better. E.g. use the APP “VpnCilla” (chargeable).

![app_access.png](../de/img/app_access.png)![app_second_ip.png](../de/img/app_second_ip.png)

# Step 3 without password: Login with password (local login)

1. Uncheck the box “Use Password Login” and enter your IP + port from ioBroker and press the “Reconnect” button.

![app_login_first_wo_pw.png](../de/img/app_login_first_wo_pw.png)

2. Set the state `noPwdAllowed` to true (without the Confirmed checkmark) and then set the `approved` state to true (without the Confirmed checkmark).

![request_approved_wo_pw.png](img/request_approved_wo_pw.png)

3. If everything was implemented correctly then it should look like this.

![app_login_wo_pw_suc.png](../de/img/app_login_wo_pw_suc.png)
![approved_wo_pw.png](../de/img/approved_wo_pw.png)

# Important informations

- If you want to block a user, simply set the “approved” state to false.
- A green checkmark now appears at the top left of the view when you are connected.
- If a red WLAN symbol flashes there, then no connection can be established. Either you are not on the same network or the state “approved” is false.

![app_connection_on.png](../de/img/app_connection_on.png)
![app_connection_off.png](../de/img/app_connection_off.png)

-   [Secure Connection](secureCon.md)
-   [Simple AES encryption](aessecure.md)

-   [Back to Summary](/docs/en/README.md)
-   [Step 1: Installation and APP setup](app.md)
-   [Step 2: Create Enums](enum.md)
-   [Step 3: Create Widgets](widgets.md)
-   [step 4: Create Screens](sreens.md)
-   [Step 5: Create Backups](backups.md)