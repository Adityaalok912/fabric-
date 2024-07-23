/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    async InitLedger(ctx) {
        const assets = [
            {
                
                ID: 'car1',
                Location: 'patna',
                Ram: 1005,
                N_W: 1000,
                Cpu: 46,
            },
            {
                ID: 'car2',
                Location: 'guwahati',
                Ram: 5200,
                N_W: 1253,
                Cpu: 36,
            },
            {
                ID: 'car3',
                Location: 'delhi',
                Ram: 4256,
                N_W: 1235 ,
                Cpu: 58,
            },
            {
                ID: 'car4',
                Location: 'new delhi',
                Ram: 8002,
                N_W: 4000 ,
                Cpu: 20,
            },
            {
                ID: 'car5',
                Location: 'boring road',
                Ram: 3546,
                N_W: 2564,
                Cpu: 49,
            },
            {
                ID: 'car6',
                Location: 'somewhere',
                Ram: 7200,
                N_W: 1253,
                Cpu: 69,
            },
        ];

        const deltaRam=500;
        const deltaNW=1000;
        const deltacpu=10;

        for (const asset of assets) {
            asset.docType = 'asset';
            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
            await ctx.stub.putState(asset.ID, Buffer.from(stringify(sortKeysRecursive(asset))));
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
    // CreateAsset -> CreateNode
    async CreateNode(ctx, id, location, ram, n_w, cpu) {
        const exists = await this.NodeExists(ctx, id);
        if (exists) {
            throw new Error(`The asset ${id} already exists`);
        }

        if(cpu<3 || cpu>100)
            {
                throw new Error(`The given input by ${id} is not valid `);
            }
        if(ram<3|| ram>99)
                {
                    throw new Error(`The given input by ${id} is not valid `);
                }




        const asset = {
            ID: id,
            Location: location,
            Ram: ram,
            N_W: n_w,
            Cpu: cpu,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return JSON.stringify(asset);
    }

    // ReadAsset returns the asset stored in the world state with given id.
    // ReadAsset -> ReadInfo
    async ReadInfo(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
    //updateLocation 
    async UpdateLocation(ctx, id, newlocation) {
        const exists = await this.NodeExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        // overwriting original asset with new asset
        const carString = await this.ReadInfo(ctx, id);
        const car = JSON.parse(carString);
        //const oldlocation = car.Location;
        car.Location = newlocation;
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(car))));
    }
    // -------------------------------------------------------------------------------------//
    //
    //UpdateRam
    async UpdateRam(ctx, id, newram) {
        const exists = await this.NodeExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        
         // overwriting original asset with new asset
        const carString = await this.ReadInfo(ctx, id);
        const car = JSON.parse(carString);
        // 
         const deltaRam=100;
          const oldram =parseInt(car.Ram, 10);
          const newramint=parseInt(newram, 10);
          if(newramint<30)
            {
                throw new Error(`The given input by ${id} is not valid `);
            }
          if(Math.abs(oldram-newramint)>deltaRam)
            {
                throw new Error(`The given input by ${id} is not valid `);
            }
        //
        car.Ram = newram;
        
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(car))));
    }
    //--------------------------------------------------------------------------------------//
    //update N_W

    async UpdateN_W(ctx, id, newn_w) {
        const exists = await this.NodeExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
         // overwriting original asset with new asset
        const carString = await this.ReadInfo(ctx, id);
        const car = JSON.parse(carString);

        const deltaNw=1000;
          const oldnw =parseInt(car.N_W, 10);
          const newnwint=parseInt(newn_w, 10);
          if(Math.abs(oldram-newnwint)>deltaNw)
            {
                throw new Error(`The given input by ${id} is not valid `);
            }
        
          car.N_W = newn_w;
        
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(car))));
    }

    //------------------------------------------------------------------------------------------//
    //updateCpu
    async UpdateCpu(ctx, id, newcpu) {
        const exists = await this.NodeExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
         // overwriting original asset with new asset
        const carString = await this.ReadInfo(ctx, id);
        const car = JSON.parse(carString);


        const deltacpu=5;
          const oldcpu =parseInt(car.Cpu, 10);
          const newcpuint=parseInt(newcpu, 10);
          if(newcpu<3)
            {
                throw new Error(`The given input by ${id} is not valid `);
            }
          if(Math.abs(oldcpu-newcpuint)>deltacpu)
            {
                throw new Error(`The given input by ${id} is not valid `);
            }

        car.Cpu = newcpu;
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(car))));
    }

    // UpdateAsset -> UpdateNode
    async UpdateNode(ctx, id, location, ram, n_w, cpu) {
        const exists = await this.NodeExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        // overwriting original asset with new asset
        if(cpu<3 || cpu>100)
            {
                throw new Error(`The given input by ${id} is not valid `);
            }
        if(ram<3|| ram>99)
                {
                    throw new Error(`The given input by ${id} is not valid `);
                }


        const updatedAsset = {
            ID: id,
            Location: location,
            Ram: ram,
            N_W: n_w,
            Cpu: cpu,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
    }

    // DeleteAsset deletes an given asset from the world state.
    // DeleteAsset -> DeleteNode
    async DeleteNode(ctx, id) {
        const exists = await this.NodeExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    // AssetExist -> NodeExist
    async NodeExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state.
                                                                                             // NOOOO USE
    // async TransferAsset(ctx, id, newOwner) {
    //     const assetString = await this.ReadAsset(ctx, id);
    //     const asset = JSON.parse(assetString);
    //     const oldOwner = asset.Owner;
    //     asset.Owner = newOwner;
    //     // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    //     await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
    //     return oldOwner;
    // }

    // GetAllAssets returns all assets found in the world state.
    // GetAllAssets -> GetAllNode
    async GetAllNode(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}

module.exports = AssetTransfer;
